/**
 * HTML5 Canvas Weather Chart Drawer
 * Draws smooth temperature trend lines and precipitation bars.
 */

function renderTempChart(canvasElement, hourlyData, isFahrenheit = false) {
  if (!canvasElement || !hourlyData || hourlyData.length === 0) return;

  const ctx = canvasElement.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // Set physical dimensions for sharp Retina rendering
  const rect = canvasElement.getBoundingClientRect();
  canvasElement.width = rect.width * dpr;
  canvasElement.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;

  // Clear previous frame
  ctx.clearRect(0, 0, width, height);

  // Convert temps if unit is Fahrenheit
  const temps = hourlyData.map(h => isFahrenheit ? Math.round((h.temp * 9/5) + 32) : h.temp);
  const pops = hourlyData.map(h => h.pop || 0);

  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const tempRange = Math.max(1, maxTemp - minTemp);

  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 40;
  const paddingBottom = 40;

  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;

  const stepX = graphWidth / (temps.length - 1);

  // Helper to map index & value to Canvas coordinates
  function getX(i) {
    return paddingLeft + i * stepX;
  }
  function getY(val) {
    return paddingTop + graphHeight - ((val - minTemp) / tempRange) * graphHeight;
  }

  // 1. Draw Rain Probability Bars at Bottom
  pops.forEach((pop, i) => {
    if (pop > 0) {
      const barX = getX(i) - 6;
      const barHeight = (pop / 100) * 35;
      const barY = height - paddingBottom - barHeight;

      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(barX, barY, 12, barHeight, [4, 4, 0, 0]);
      } else {
        ctx.rect(barX, barY, 12, barHeight);
      }
      ctx.fill();
    }
  });

  // 2. Draw Temperature Bezier Spline
  ctx.beginPath();
  ctx.moveTo(getX(0), getY(temps[0]));

  for (let i = 0; i < temps.length - 1; i++) {
    const x0 = getX(i);
    const y0 = getY(temps[i]);
    const x1 = getX(i + 1);
    const y1 = getY(temps[i + 1]);

    const cpX1 = x0 + (x1 - x0) / 2;
    const cpY1 = y0;
    const cpX2 = x0 + (x1 - x0) / 2;
    const cpY2 = y1;

    ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x1, y1);
  }

  // 3. Fill Gradient under Line
  const gradient = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
  gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

  const linePath = new Path2D();
  linePath.moveTo(getX(0), getY(temps[0]));
  for (let i = 0; i < temps.length - 1; i++) {
    const x0 = getX(i);
    const y0 = getY(temps[i]);
    const x1 = getX(i + 1);
    const y1 = getY(temps[i + 1]);
    linePath.bezierCurveTo(x0 + (x1 - x0) / 2, y0, x0 + (x1 - x0) / 2, y1, x1, y1);
  }

  linePath.lineTo(getX(temps.length - 1), height - paddingBottom);
  linePath.lineTo(getX(0), height - paddingBottom);
  linePath.closePath();

  ctx.fillStyle = gradient;
  ctx.fill(linePath);

  // Stroke Line
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0; // Reset shadow

  // 4. Draw Data Points and Text Labels
  hourlyData.forEach((h, i) => {
    // Only label every 2nd or 3rd hour if width is narrow
    const showLabel = width < 500 ? i % 3 === 0 : i % 2 === 0;

    const x = getX(i);
    const y = getY(temps[i]);

    // Glowing Dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (showLabel) {
      // Temperature Text Above Dot
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${temps[i]}°`, x, y - 12);

      // Time Text Below Graph
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 11px Outfit, sans-serif';
      ctx.fillText(h.time.split(':')[0] + h.time.slice(-2), x, height - 12);
    }
  });
}
