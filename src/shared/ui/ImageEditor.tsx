import React, {useEffect, useMemo, useRef, useState} from "react";
import {ArrowLeftRight, RotateCcw, RotateCw, ZoomIn, ZoomOut, X} from "lucide-react";
import {Modal, Button} from "@/shared/ui";
import {
  clamp,
  clampOffset,
  getEditorFileName,
  getMinimumZoom,
  getRotatedDimensions,
  isValidEditorMimeType,
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
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: (file: File) => void;
}

const MAX_ZOOM_FACTOR = 3;
const MIN_ZOOM_FACTOR = 1;
const PREVIEW_SIZE = 300;
const OUTPUT_SIZE = 1280;

const Stage = ({
                 source,
                 image,
                 cropRef,
                 cropWidth,
                 cropHeight,
                 displayWidth,
                 displayHeight,
                 offsetX,
                 offsetY,
                 rotation,
                 onPointerDown,
                 onPointerMove,
                 onPointerUp,
                 onWheel,
                 imageAlt,
                 label,
               }: {
  source: string;
  image: HTMLImageElement;
  cropRef: React.RefObject<HTMLDivElement>; // changed from HTMLDivElement | null
  cropWidth: number;
  cropHeight: number;
  displayWidth: number;
  displayHeight: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  onPointerDown: React.PointerEventHandler<HTMLDivElement>;
  onPointerMove: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp: React.PointerEventHandler<HTMLDivElement>;
  onWheel: React.WheelEventHandler<HTMLDivElement>;
  imageAlt: string;
  label: string;
}) => {
  return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            {Math.round(cropWidth)} × {Math.round(cropHeight)} px
          </p>
        </div>

        <div
            ref={cropRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onWheel={onWheel}
            className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.96),_rgba(15,23,42,0.88))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] touch-none select-none"
            style={{touchAction: "none"}}
        >
          <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div
                className="relative overflow-hidden will-change-transform"
                style={{
                  width: `${displayWidth}px`,
                  height: `${displayHeight}px`,
                  transform: `translate(${offsetX}px, ${offsetY}px)`,
                }}
            >
              <img
                  src={source}
                  alt={imageAlt}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }}
              />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-[16%] rounded-[28px] border-2 border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.34)]">
            <div className="absolute left-1/3 top-0 h-full w-px bg-white/45" />
            <div className="absolute left-2/3 top-0 h-full w-px bg-white/45" />
            <div className="absolute top-1/3 left-0 h-px w-full bg-white/45" />
            <div className="absolute top-2/3 left-0 h-px w-full bg-white/45" />
          </div>

          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
            Перетащите фото, чтобы подобрать кадр
          </div>

          <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
            Колесо мыши и pinch-зум
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-slate-500">
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            Zoom: {Math.round((displayWidth / getRotatedDimensions(image.naturalWidth, image.naturalHeight, rotation).width) * 100)}%
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            Rotate: {rotation}°
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            Move: active
          </div>
        </div>
      </div>
  );
};

export const ImageEditor: React.FC<ImageEditorProps> = ({
                                                          open,
                                                          source,
                                                          title = "Редактировать фото",
                                                          description = "Подгоните кадр перед загрузкой",
                                                          onClose,
                                                          onConfirm,
                                                        }) => {
  const cropRef = useRef<HTMLDivElement>(null); // FIXED: removed | null
  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const pointerStateRef = useRef<{
    pointers: Map<number, {x: number; y: number}>;
    gesture: null
        | {
      type: "drag";
      startOffsetX: number;
      startOffsetY: number;
    }
        | {
      type: "pinch";
      startZoom: number;
      startDistance: number;
    };
  }>({pointers: new Map(), gesture: null});

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropSize, setCropSize] = useState({width: 0, height: 0});
  const [rotation, setRotation] = useState(0);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !source) {
      return;
    }

    let cancelled = false;
    setLoadError(null);
    setImage(null);
    setRotation(0);
    setZoomFactor(1);
    setOffset({x: 0, y: 0});

    loadImage(source.src)
        .then((loadedImage) => {
          if (cancelled) return;
          imageRef.current = loadedImage;
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
  }, [open, source?.src]);

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
  }, [open]);

  const rotatedDimensions = useMemo(() => {
    if (!image) return {width: 0, height: 0};
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

  const effectiveScale = minZoom * zoomFactor;
  const displayWidth = rotatedDimensions.width * effectiveScale;
  const displayHeight = rotatedDimensions.height * effectiveScale;

  useEffect(() => {
    // FIXED: map clampOffset result to { x, y }
    setOffset((prev) => {
      const clamped = clampOffset(
          prev.x,
          prev.y,
          displayWidth,
          displayHeight,
          cropSize.width,
          cropSize.height,
      );
      return { x: clamped.offsetX, y: clamped.offsetY };
    });
  }, [displayWidth, displayHeight, cropSize.width, cropSize.height]);

  const outputMimeType = supportsWebpCanvasEncoding()
      ? "image/webp"
      : "image/jpeg";

  const clampZoom = (nextZoom: number) => {
    setZoomFactor(clamp(nextZoom, MIN_ZOOM_FACTOR, MAX_ZOOM_FACTOR));
  };

  const moveOffset = (nextX: number, nextY: number) => {
    // FIXED: map clampOffset result to { x, y }
    const clamped = clampOffset(
        nextX,
        nextY,
        displayWidth,
        displayHeight,
        cropSize.width,
        cropSize.height,
    );
    setOffset({ x: clamped.offsetX, y: clamped.offsetY });
  };

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!image) return;

    const current = pointerStateRef.current;
    current.pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);

    if (current.pointers.size === 1) {
      current.gesture = {
        type: "drag",
        startOffsetX: offset.x,
        startOffsetY: offset.y,
      };
    }

    if (current.pointers.size === 2) {
      const [first, second] = Array.from(current.pointers.values());
      current.gesture = {
        type: "pinch",
        startZoom: zoomFactor,
        startDistance: Math.hypot(first.x - second.x, first.y - second.y),
      };
    }
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const current = pointerStateRef.current;
    if (!current.pointers.has(event.pointerId)) return;

    current.pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});

    if (!current.gesture) return;

    if (current.gesture.type === "drag" && current.pointers.size === 1) {
      const previous = current.pointers.get(event.pointerId);
      if (!previous) return;

      const deltaX = event.clientX - previous.x;
      const deltaY = event.clientY - previous.y;

      moveOffset(offset.x + deltaX, offset.y + deltaY);
      return;
    }

    if (current.gesture.type === "pinch" && current.pointers.size >= 2) {
      const [first, second] = Array.from(current.pointers.values());
      const nextDistance = Math.hypot(first.x - second.x, first.y - second.y);
      if (current.gesture.startDistance === 0) return;

      const nextZoom = clamp(
          current.gesture.startZoom * (nextDistance / current.gesture.startDistance),
          MIN_ZOOM_FACTOR,
          MAX_ZOOM_FACTOR,
      );
      setZoomFactor(nextZoom);
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
        startOffsetX: offset.x,
        startOffsetY: offset.y,
      };

      if (remaining) {
        moveOffset(offset.x, offset.y);
      }
    }
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    if (!image) return;
    event.preventDefault();

    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    clampZoom(zoomFactor + delta);
  };

  const resetTransform = () => {
    setRotation(0);
    setZoomFactor(1);
    setOffset({x: 0, y: 0});
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
        scale: effectiveScale,
        offsetX: offset.x,
        offsetY: offset.y,
        mimeType: outputMimeType,
      });

      const file = new File(
          [blob],
          getEditorFileName(source.fileName, blob.type || outputMimeType),
          {
            type: blob.type || outputMimeType,
          },
      );

      onConfirm(file);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [open]);

  if (!open || !source) return null;

  const imageAlt = source.fileName || "Выбранное изображение";

  return (
      <Modal
          open={open}
          onClose={onClose}
          isShaded
          className="md:max-w-6xl w-full max-h-[100vh] md:max-h-[92vh]"
          header={{
            title,
            description,
            icon: <ArrowLeftRight size={20} />,
          }}
          footer={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                  type="button"
                  variant="outline"
                  onClick={resetTransform}
                  className="h-11 rounded-xl font-bold"
                  disabled={isProcessing || !image}
              >
                <RotateCcw size={16} />
                <span className="ml-2">Сбросить</span>
              </Button>
              <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRotation((value) => (value + 270) % 360)}
                  className="h-11 rounded-xl font-bold"
                  disabled={isProcessing || !image}
              >
                <RotateCcw size={16} />
                <span className="ml-2">Влево</span>
              </Button>
              <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRotation((value) => (value + 90) % 360)}
                  className="h-11 rounded-xl font-bold"
                  disabled={isProcessing || !image}
              >
                <RotateCw size={16} />
                <span className="ml-2">Вправо</span>
              </Button>
              <Button
                  type="button"
                  onClick={handleConfirm}
                  className="h-11 rounded-xl font-bold"
                  isLoading={isProcessing}
                  disabled={isProcessing || !image}
              >
                Готово
              </Button>
            </div>
          }
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-5">
            {loadError ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
                  {loadError}
                </div>
            ) : !image ? (
                <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-sm font-bold text-slate-500">
                  Загрузка изображения...
                </div>
            ) : (
                <>
                  <Stage
                      source={source.src}
                      image={image}
                      cropRef={cropRef}
                      cropWidth={cropSize.width}
                      cropHeight={cropSize.height}
                      displayWidth={displayWidth}
                      displayHeight={displayHeight}
                      offsetX={offset.x}
                      offsetY={offset.y}
                      rotation={rotation}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onWheel={handleWheel}
                      imageAlt={imageAlt}
                      label="Область crop"
                  />

                  <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Zoom
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => clampZoom(zoomFactor - 0.1)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
                            disabled={isProcessing || !image}
                        >
                          <ZoomOut size={16} />
                        </button>
                        <input
                            type="range"
                            min={MIN_ZOOM_FACTOR}
                            max={MAX_ZOOM_FACTOR}
                            step={0.01}
                            value={zoomFactor}
                            onChange={(event) =>
                                clampZoom(parseFloat(event.target.value))
                            }
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-primary"
                            aria-label="Zoom"
                        />
                        <button
                            type="button"
                            onClick={() => clampZoom(zoomFactor + 0.1)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
                            disabled={isProcessing || !image}
                        >
                          <ZoomIn size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Поворот
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {rotation}°
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Размер
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {Math.round(displayWidth)} × {Math.round(displayHeight)}
                      </p>
                    </div>
                  </div>
                </>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Original
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700 break-all">
                    {source.fileName}
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
                  {source.mimeType}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100">
                <img
                    src={source.src}
                    alt={imageAlt}
                    className="h-56 w-full object-cover"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Result
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    Preview after crop
                  </p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
                  {supportsWebpCanvasEncoding() ? "WebP" : "JPEG"}
                </div>
              </div>

              {image ? (
                  <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100">
                    <div
                        className="relative mx-auto overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.96),_rgba(15,23,42,0.88))]"
                        style={{width: PREVIEW_SIZE, height: PREVIEW_SIZE}}
                    >
                      <div
                          className="absolute inset-0 opacity-35"
                          style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                            backgroundSize: "18px 18px",
                          }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="overflow-hidden"
                            style={{
                              width: `${(PREVIEW_SIZE / cropSize.width) * displayWidth}px`,
                              height: `${(PREVIEW_SIZE / cropSize.height) * displayHeight}px`,
                              transform: `translate(${
                                  offset.x * (PREVIEW_SIZE / cropSize.width)
                              }px, ${offset.y * (PREVIEW_SIZE / cropSize.height)}px)`,
                            }}
                        >
                          <img
                              src={source.src}
                              alt={imageAlt}
                              draggable={false}
                              className="h-full w-full object-cover"
                              style={{
                                transform: `rotate(${rotation}deg)`,
                                transformOrigin: "center center",
                              }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              ) : (
                  <div className="mt-4 flex h-64 items-center justify-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">
                    Результат появится после загрузки изображения
                  </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-brand-50 p-2 text-brand-primary">
                  <X size={14} className="rotate-45" />
                </div>
                <p className="font-medium leading-relaxed">
                  Кадрирование и поворот выполняются локально в браузере. На
                  сервер уйдет только уже готовый файл.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
  );
};

export type {EditorSource};