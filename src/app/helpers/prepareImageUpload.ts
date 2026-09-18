/**
 * Cloudinary (plan free) rechaza imágenes de más de 10 MB y devuelve
 * "File size too large", así que las fotos que salen del teléfono o de una
 * herramienta de IA fallaban al subir. Antes de enviarlas se reescalan y
 * recomprimen en el navegador: el admin no tiene que preparar nada a mano.
 *
 * Solo toca imágenes rasterizadas. SVG, PDF y videos pasan intactos (no se
 * pueden recomprimir en canvas sin perder lo que los hace útiles).
 */

/** Tope real de Cloudinary free: 10 MB. Se deja margen para el multipart. */
const MAX_BYTES = 8_500_000;
/** Por encima de esto no vale la pena tocar el archivo. */
const SAFE_BYTES = 2_000_000;
/** Ninguna pieza del catálogo necesita más resolución que esto. */
const MAX_DIMENSION = 2400;
const QUALITY_STEPS = [0.85, 0.7, 0.55, 0.4];

const RECOMPRESSIBLE = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

function canRecompress(file: File): boolean {
  return RECOMPRESSIBLE.includes(file.type);
}

async function toBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

function scaledSize(width: number, height: number) {
  const longest = Math.max(width, height);
  if (longest <= MAX_DIMENSION) return { width, height };
  const ratio = MAX_DIMENSION / longest;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function renamed(file: File, blob: Blob, type: string): File {
  const base = file.name.replace(/\.[^.]+$/, '');
  const extension = type === 'image/webp' ? 'webp' : 'jpg';
  return new File([blob], `${base}.${extension}`, {
    type,
    lastModified: Date.now(),
  });
}

/**
 * Devuelve el mismo archivo si ya es liviano, o una versión reescalada y
 * recomprimida. Si algo falla (formato raro, canvas bloqueado) devuelve el
 * original: que decida el backend en vez de perder la subida aquí.
 */
export async function prepareImageUpload(file: File): Promise<File> {
  if (file.size <= SAFE_BYTES || !canRecompress(file)) return file;

  try {
    const bitmap = await toBitmap(file);
    const { width, height } = scaledSize(bitmap.width, bitmap.height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return file;
    // El PNG con transparencia pasa a fondo blanco al volverse JPEG/WEBP: es
    // lo esperado para banners y fotos de catálogo.
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const outputType = 'image/webp';
    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, outputType, quality);
      if (!blob) break;
      if (blob.size <= MAX_BYTES) {
        // Si la "optimización" salió más pesada que el original, no sirve.
        return blob.size < file.size ? renamed(file, blob, outputType) : file;
      }
    }
    return file;
  } catch {
    return file;
  }
}

/** Igual que prepareImageUpload pero para varios archivos. */
export async function prepareImageUploads(files: File[]): Promise<File[]> {
  return Promise.all(files.map(prepareImageUpload));
}
