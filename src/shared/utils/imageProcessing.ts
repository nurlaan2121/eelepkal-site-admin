export const IMAGE_EDITOR_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const IMAGE_EDITOR_MAX_SOURCE_SIZE = 15 * 1024 * 1024;

export const IMAGE_EDITOR_MAX_OUTPUT_SIZE = 5 * 1024 * 1024;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeRotation(rotation: number) {
  const normalized = rotation % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function getRotatedDimensions(
  width: number,
  height: number,
  rotation: number,
) {
  const normalized = normalizeRotation(rotation);

  if (normalized === 90 || normalized === 270) {
    return {width: height, height: width};
  }

  return {width, height};
}

export function getMinimumZoom(
  imageWidth: number,
  imageHeight: number,
  cropWidth: number,
  cropHeight: number,
  rotation: number,
) {
  const rotated = getRotatedDimensions(imageWidth, imageHeight, rotation);
  return Math.max(cropWidth / rotated.width, cropHeight / rotated.height);
}

export function clampOffset(
  offsetX: number,
  offsetY: number,
  displayWidth: number,
  displayHeight: number,
  cropWidth: number,
  cropHeight: number,
) {
  const maxOffsetX = Math.max(0, (displayWidth - cropWidth) / 2);
  const maxOffsetY = Math.max(0, (displayHeight - cropHeight) / 2);

  return {
    offsetX: clamp(offsetX, -maxOffsetX, maxOffsetX),
    offsetY: clamp(offsetY, -maxOffsetY, maxOffsetY),
  };
}

export function isValidEditorMimeType(mimeType: string) {
  return IMAGE_EDITOR_ALLOWED_MIME_TYPES.includes(mimeType);
}

export function supportsWebpCanvasEncoding() {
  const canvas = document.createElement("canvas");
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

export async function loadImage(source: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    if (!source.startsWith("blob:") && !source.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Не удалось загрузить изображение"));
    image.src = source;
  });
}

export async function renderEditedImage(params: {
  image: HTMLImageElement;
  cropWidth: number;
  cropHeight: number;
  outputSize: number;
  rotation: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  mimeType: string;
  quality?: number;
}) {
  const {
    image,
    cropWidth,
    cropHeight,
    outputSize,
    rotation,
    scale,
    offsetX,
    offsetY,
    mimeType,
    quality = 0.92,
  } = params;

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas context is not available");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, outputSize, outputSize);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const ratioX = outputSize / cropWidth;
  const ratioY = outputSize / cropHeight;
  const renderRatio = Math.min(ratioX, ratioY);
  const normalizedRotation = normalizeRotation(rotation);
  const radians = (normalizedRotation * Math.PI) / 180;
  const centerX = outputSize / 2 + offsetX * renderRatio;
  const centerY = outputSize / 2 + offsetY * renderRatio;

  context.translate(centerX, centerY);
  context.rotate(radians);
  context.scale(scale * renderRatio, scale * renderRatio);
  context.drawImage(
    image,
    -image.naturalWidth / 2,
    -image.naturalHeight / 2,
    image.naturalWidth,
    image.naturalHeight,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Не удалось обработать изображение"));
          return;
        }

        resolve(result);
      },
      mimeType,
      quality,
    );
  });

  return blob;
}

export function getEditorFileName(fileName: string, mimeType: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "menu-image";
  const extension = mimeType === "image/webp" ? "webp" : "jpg";
  return `${baseName}.${extension}`;
}
