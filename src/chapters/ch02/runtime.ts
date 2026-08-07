export function initializeChapter(article: HTMLElement): () => void {
  const canvas = article.querySelector<HTMLCanvasElement>("#powersPlot");
  if (!canvas) return () => undefined;

  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(300, Math.floor(rect.width));
    const height = Math.max(288, Math.floor(width * 0.52));
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--muted").trim();
    const line = css.getPropertyValue("--line").trim();
    const accent = css.getPropertyValue("--accent").trim();
    context.clearRect(0, 0, width, height);

    const padding = { left: 46, right: 18, top: 18, bottom: 38 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    context.strokeStyle = line;
    context.fillStyle = ink;
    context.font = "11px ui-sans-serif, system-ui";
    context.lineWidth = 1;

    for (const tick of [0, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
      const y = padding.top + plotHeight - (tick / 941) * plotHeight;
      context.beginPath();
      context.moveTo(padding.left, y);
      context.lineTo(width - padding.right, y);
      context.stroke();
      context.fillText(String(tick), 8, y + 4);
    }
    for (const tick of [0, 30, 60, 90, 120, 150, 180, 210, 240, 270]) {
      const x = padding.left + (tick / 270) * plotWidth;
      context.fillText(String(tick), x - 8, height - 12);
    }

    let value = 1n;
    context.fillStyle = accent;
    for (let exponent = 1; exponent <= 270; exponent += 1) {
      value = (value * 627n) % 941n;
      const x = padding.left + (exponent / 270) * plotWidth;
      const y = padding.top + plotHeight - (Number(value) / 941) * plotHeight;
      context.beginPath();
      context.arc(x, y, 1.7, 0, Math.PI * 2);
      context.fill();
    }
  };

  const resizeObserver = new ResizeObserver(draw);
  resizeObserver.observe(canvas);
  const themeObserver = new MutationObserver(draw);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  draw();

  return () => {
    resizeObserver.disconnect();
    themeObserver.disconnect();
  };
}
