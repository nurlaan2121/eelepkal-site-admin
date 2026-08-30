import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ArrowLeft, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  clamp,
  clampOffset,
  getEditorFileName,
  getMinimumZoom,
  getRotatedDimensions,
  loadImage,
  renderEditedImage,
  supportsWebpCanvasEncoding,
} from "@/shared/utils/imageProcessing";

type EditorSource = {
  src: string;
  fileName: string;
  mimeType: string;
};

interface ImageEditorProps {
  open: boolean;
  source: EditorSource | null;
  onClose: () => void;
  onConfirm: (file: File) => void;
}

const MAX_ZOOM_FACTOR = 5;
const MIN_ZOOM_FACTOR = 0.05;
const OUTPUT_SIZE = 1280;


const Stage = ({
  source,
  image,
  cropRef,
  baseWidth,
  baseHeight,
  cssScale,
  offsetX,
  offsetY,
  rotation,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  imageAlt,
}: {
  source: string;
  image: HTMLImageElement;
  cropRef: React.RefObject<HTMLDivElement>;
  baseWidth: number;
  baseHeight: number;
  cssScale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  onPointerDown: React.PointerEventHandler<HTMLDivElement>;
  onPointerMove: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp: React.PointerEventHandler<HTMLDivElement>;
  onWheel: React.WheelEventHandler<HTMLDivElement>;
  imageAlt: string;
}) => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-4">
      <div
        ref={cropRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        className="relative aspect-square w-full overflow-hidden bg-black/50 touch-none select-none rounded-[16px] md:rounded-[32px] shadow-2xl border border-white/10"
        style={{ touchAction: "none" }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {image && (
            <img
              src={source}
              alt={imageAlt}
              draggable={false}
              className="max-w-none will-change-transform select-none pointer-events-none origin-center"
              style={{
                width: `${baseWidth}px`,
                height: `${baseHeight}px`,
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${cssScale}) rotate(${rotation}deg)`,
              }}
            />
          )}
        </div>

        {/* 3x3 Grid Overlay */}
        <div className="pointer-events-none absolute inset-0 border border-white/20">
          <div className="absolute left-1/3 top-0 h-full w-px bg-white/30" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-white/30" />
          <div className="absolute top-1/3 left-0 h-px w-full bg-white/30" />
          <div className="absolute top-2/3 left-0 h-px w-full bg-white/30" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2 pointer-events-none opacity-50">
        <span className="bg-white/10 backdrop-blur rounded-full px-3 py-1 text-[10px] uppercase font-bold text-white tracking-widest border border-white/10">Свайп / Drag</span>
        <span className="bg-white/10 backdrop-blur rounded-full px-3 py-1 text-[10px] uppercase font-bold text-white tracking-widest border border-white/10">Pinch / Zoom</span>
      </div>
    </div>
  );
};

export const ImageEditor: React.FC<ImageEditorProps> = ({
  open,
  source,
  onClose,
  onConfirm,
}) => {
  const cropRef = useRef<HTMLDivElement>(null!);
  const pointerStateRef = useRef<{
    pointers: Map<number, { x: number; y: number }>;
    gesture: null
    | {
      type: "drag";
      startX: number;
      startY: number;
      startOffsetX: number;
      startOffsetY: number;
    }
    | {
      type: "pinch";
      startZoom: number;
      startDistance: number;
    };
  }>({ pointers: new Map(), gesture: null });

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState(0);

  // State refs for fast synced physical gesture math
  const zoomFactorRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  const [zoomFactor, _setZoomFactor] = useState(1);
  const [offset, _setOffset] = useState({ x: 0, y: 0 });

  const setZoomFactor = useCallback((val: number) => {
    zoomFactorRef.current = val;
    _setZoomFactor(val);
  }, []);

  const setOffset = useCallback((val: { x: number; y: number }) => {
    offsetRef.current = val;
    _setOffset(val);
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!open || !source) return;

    let cancelled = false;
    setLoadError(null);
    setImage(null);
    setRotation(0);
    setZoomFactor(1);
    setOffset({ x: 0, y: 0 });
    setIsInitialized(false);
    pointerStateRef.current = { pointers: new Map(), gesture: null };

    loadImage(source.src)
      .then((loadedImage) => {
        if (cancelled) return;
        setImage(loadedImage);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Не удалось открыть изображение";
        setLoadError(message);
      });

    return () => {
      cancelled = true;
    };
  }, [open, source?.src, setZoomFactor, setOffset]);

  useEffect(() => {
    if (!open || !cropRef.current) return;

    const element = cropRef.current;
    const updateSize = () => {
      setCropSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [open, image]);

  const rotatedDimensions = useMemo(() => {
    if (!image) return { width: 0, height: 0 };
    return getRotatedDimensions(
      image.naturalWidth,
      image.naturalHeight,
      rotation,
    );
  }, [image, rotation]);

  const minZoom = useMemo(() => {
    if (!image || cropSize.width === 0 || cropSize.height === 0) {
      return 1;
    }
    return getMinimumZoom(
      image.naturalWidth,
      image.naturalHeight,
      cropSize.width,
      cropSize.height,
      rotation,
    );
  }, [image, cropSize, rotation]);

  // Always use minZoom at rotation 0 for consistent base DOM scale
  const baseScale = useMemo(() => {
    if (!image || cropSize.width === 0 || cropSize.height === 0) return 1;
    return getMinimumZoom(image.naturalWidth, image.naturalHeight, cropSize.width, cropSize.height, 0);
  }, [image, cropSize.width, cropSize.height]);

  const cssScale = zoomFactor / baseScale;
  const baseWidth = image ? image.naturalWidth * baseScale : 0;
  const baseHeight = image ? image.naturalHeight * baseScale : 0;

  useEffect(() => {
    if (image && cropSize.width > 0 && cropSize.height > 0 && !isInitialized) {
      setZoomFactor(minZoom);
      setIsInitialized(true);
    }
  }, [image, cropSize, minZoom, isInitialized, setZoomFactor]);

  // Keep strictly bounded
  useEffect(() => {
    if (!isInitialized) return;
    const currentZ = zoomFactorRef.current;
    const clampedZ = clamp(currentZ, minZoom, MAX_ZOOM_FACTOR);

    if (clampedZ !== currentZ) {
      setZoomFactor(clampedZ);
    }

    const dw = rotatedDimensions.width * clampedZ;
    const dh = rotatedDimensions.height * clampedZ;
    const currentOffset = offsetRef.current;

    const clampedOffset = clampOffset(
      currentOffset.x,
      currentOffset.y,
      dw,
      dh,
      cropSize.width,
      cropSize.height,
    );

    if (clampedOffset.offsetX !== currentOffset.x || clampedOffset.offsetY !== currentOffset.y) {
      setOffset({ x: clampedOffset.offsetX, y: clampedOffset.offsetY });
    }
  }, [rotation, minZoom, rotatedDimensions, cropSize, isInitialized, setZoomFactor, setOffset]);

  const applyZoom = useCallback((nextZoom: number, focalScreenX = 0, focalScreenY = 0) => {
    const startZ = zoomFactorRef.current;
    const startOffset = offsetRef.current;
    const clampedZoom = clamp(nextZoom, minZoom, MAX_ZOOM_FACTOR);

    if (startZ === clampedZoom) return;

    const unscaledImgPtX = (focalScreenX - startOffset.x) / startZ;
    const unscaledImgPtY = (focalScreenY - startOffset.y) / startZ;

    const newOffsetX = focalScreenX - unscaledImgPtX * clampedZoom;
    const newOffsetY = focalScreenY - unscaledImgPtY * clampedZoom;

    const newDisplayWidth = rotatedDimensions.width * clampedZoom;
    const newDisplayHeight = rotatedDimensions.height * clampedZoom;

    const clamped = clampOffset(
      newOffsetX,
      newOffsetY,
      newDisplayWidth,
      newDisplayHeight,
      cropSize.width,
      cropSize.height,
    );

    setZoomFactor(clampedZoom);
    setOffset({ x: clamped.offsetX, y: clamped.offsetY });
  }, [minZoom, rotatedDimensions, cropSize, setZoomFactor, setOffset]);

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!image) return;

    const current = pointerStateRef.current;
    current.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);

    if (current.pointers.size === 1) {
      current.gesture = {
        type: "drag",
        startX: event.clientX,
        startY: event.clientY,
        startOffsetX: offsetRef.current.x,
        startOffsetY: offsetRef.current.y,
      };
    }

    if (current.pointers.size === 2) {
      const [first, second] = Array.from(current.pointers.values());
      current.gesture = {
        type: "pinch",
        startZoom: zoomFactorRef.current,
        startDistance: Math.hypot(first.x - second.x, first.y - second.y),
      };
    }
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const current = pointerStateRef.current;
    if (!current.pointers.has(event.pointerId)) return;

    current.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (!current.gesture) return;

    if (current.gesture.type === "drag" && current.pointers.size === 1) {
      const deltaX = event.clientX - current.gesture.startX;
      const deltaY = event.clientY - current.gesture.startY;

      const currentZ = zoomFactorRef.current;
      const dw = rotatedDimensions.width * currentZ;
      const dh = rotatedDimensions.height * currentZ;

      const clamped = clampOffset(
        current.gesture.startOffsetX + deltaX,
        current.gesture.startOffsetY + deltaY,
        dw,
        dh,
        cropSize.width,
        cropSize.height,
      );
      setOffset({ x: clamped.offsetX, y: clamped.offsetY });
      return;
    }

    if (current.gesture.type === "pinch" && current.pointers.size >= 2) {
      const [first, second] = Array.from(current.pointers.values());
      const nextDistance = Math.hypot(first.x - second.x, first.y - second.y);
      if (current.gesture.startDistance === 0) return;

      const nextZoom = current.gesture.startZoom * (nextDistance / current.gesture.startDistance);

      const rect = cropRef.current.getBoundingClientRect();
      const pinchMidX = (first.x + second.x) / 2;
      const pinchMidY = (first.y + second.y) / 2;
      const focalScreenX = pinchMidX - rect.left - rect.width / 2;
      const focalScreenY = pinchMidY - rect.top - rect.height / 2;

      applyZoom(nextZoom, focalScreenX, focalScreenY);
    }
  };

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const current = pointerStateRef.current;
    current.pointers.delete(event.pointerId);

    if (current.pointers.size === 0) {
      current.gesture = null;
      return;
    }

    if (current.pointers.size === 1) {
      const [remaining] = Array.from(current.pointers.values());
      current.gesture = {
        type: "drag",
        startX: remaining.x,
        startY: remaining.y,
        startOffsetX: offsetRef.current.x,
        startOffsetY: offsetRef.current.y,
      };
    }
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    if (!image || !cropRef.current) return;
    event.preventDefault();

    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const nextZoom = zoomFactorRef.current * (1 + delta);

    const rect = cropRef.current.getBoundingClientRect();
    const focalScreenX = event.clientX - rect.left - rect.width / 2;
    const focalScreenY = event.clientY - rect.top - rect.height / 2;

    applyZoom(nextZoom, focalScreenX, focalScreenY);
  };

  const handleConfirm = async () => {
    if (!image || !source || cropSize.width === 0 || cropSize.height === 0) {
      return;
    }

    setIsProcessing(true);

    try {
      const blob = await renderEditedImage({
        image,
        cropWidth: cropSize.width,
        cropHeight: cropSize.height,
        outputSize: OUTPUT_SIZE,
        rotation,
        scale: zoomFactorRef.current,
        offsetX: offsetRef.current.x,
        offsetY: offsetRef.current.y,
        mimeType: supportsWebpCanvasEncoding() ? "image/webp" : "image/jpeg",
      });

      const file = new File(
        [blob],
        getEditorFileName(source.fileName, blob.type || "image/jpeg"),
        {
          type: blob.type || "image/jpeg",
        },
      );

      onConfirm(file);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {open && source && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-between touch-none select-none"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between px-4 py-4 md:py-6 max-w-screen-md mx-auto">
            <button
              onClick={onClose}
              className="p-3 -ml-3 text-white hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
              Кадрирование
            </div>

            <button
              onClick={handleConfirm}
              disabled={isProcessing || !image}
              className="px-4 py-2 -mr-2 text-brand-primary font-bold tracking-wide transition-colors disabled:opacity-50 hover:bg-brand-primary/10 rounded-full"
            >
              {isProcessing ? "ОБРАБОТКА" : "ГОТОВО"}
            </button>
          </div>

          {/* Main Stage */}
          <div className="flex-1 w-full flex flex-col items-center justify-center relative overscroll-none">
            {loadError ? (
              <div className="text-red-400 font-medium px-6 text-center">
                {loadError}
              </div>
            ) : !image ? (
              <div className="text-white/40 font-bold tracking-widest uppercase animate-pulse">
                Загрузка...
              </div>
            ) : (
              <Stage
                source={source.src}
                image={image}
                cropRef={cropRef}
                baseWidth={baseWidth}
                baseHeight={baseHeight}
                cssScale={cssScale}
                offsetX={offset.x}
                offsetY={offset.y}
                rotation={rotation}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onWheel={handleWheel}
                imageAlt={source.fileName || "Выбранное изображение"}
              />
            )}
          </div>

          {/* Bottom Controls */}
          {image && (
            <div className="w-full max-w-screen-md mx-auto px-6 py-8 flex flex-col gap-8 pb-safe">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                  className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all active:scale-95 text-xs font-bold"
                >
                  <RotateCcw size={20} />
                </button>

                <div className="flex flex-1 max-w-[200px] items-center gap-4">
                  <ZoomOut size={18} className="text-white/50" />
                  <input
                    type="range"
                    min={Math.max(0.01, minZoom)}
                    max={MAX_ZOOM_FACTOR}
                    step={0.01}
                    value={zoomFactor}
                    onChange={(e) => applyZoom(parseFloat(e.target.value), 0, 0)}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none accent-white cursor-pointer"
                  />
                  <ZoomIn size={18} className="text-white/50" />
                </div>

                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all active:scale-95 text-xs font-bold"
                >
                  <RotateCw size={20} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export type { EditorSource };