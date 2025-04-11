document.getElementById("playBtn").addEventListener("click", () => {
  const canvas = document.getElementById("gameCanvas");
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");

  // Dibujo simple estilo "bloque"
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(50, 50, 50, 50);
  ctx.fillStyle = "#8BC34A";
  ctx.fillRect(100, 100, 50, 50);
});