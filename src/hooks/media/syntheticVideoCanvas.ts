export function renderSyntheticFrame(ctx: CanvasRenderingContext2D, width: number, height: number, hue: number) {
  ctx.save();
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, `hsl(${hue}, 65%, 22%)`);
  grad.addColorStop(1, `hsl(${(hue + 50) % 360}, 60%, 14%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 - 20, 48, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.fill();
  ctx.restore();
}
