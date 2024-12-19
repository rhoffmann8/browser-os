export function randomRgba(opacity: number) {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function getButtonBackgroundGradientStyles(
  color1: string,
  color2?: string
) {
  color2 = color2 ?? `color-mix(in srgb, ${color1} 70%, transparent)`;
  const normal = `linear-gradient(${color1}, ${color2})`;
  const pressed = `linear-gradient(${color2}, ${color1})`;
  return { normal, pressed };
}

let canvasCache: HTMLCanvasElement;
export function getTextWidth(text: string, font: string) {
  const canvas =
    canvasCache || (canvasCache = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  if (!context) {
    return 0;
  }

  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}
