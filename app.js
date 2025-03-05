document.getElementById('calculateBtn').addEventListener('click', function() {
  // Datos generales del proyecto
  var projectName = document.getElementById('projectName').value || "N/D";
  var projectLocation = document.getElementById('projectLocation').value || "N/D";
  
  // Parámetros de la antena y viento
  var height = parseFloat(document.getElementById('height').value);
  var width = parseFloat(document.getElementById('width').value);
  var azimuth = parseFloat(document.getElementById('azimuth').value);
  var windSpeed = parseFloat(document.getElementById('windSpeed').value);
  var windFactor = parseFloat(document.getElementById('windFactor').value);
  
  // Validar entradas
  if (isNaN(height) || isNaN(width) || isNaN(azimuth) || isNaN(windSpeed) || isNaN(windFactor)) {
    alert("Por favor, ingrese valores válidos en todos los campos.");
    return;
  }
  
  // Constantes y coeficientes
  var rho = 1.225; // densidad del aire en kg/m³
  var Cd = 1.2;    // coeficiente de arrastre
  
  // Cálculos intermedios
  var q = 0.5 * rho * Math.pow(windSpeed, 2); // Presión dinámica en Pa
  var A = height * width; // Área efectiva de la antena en m²
  
  // Fuerza del viento: F = Cd · q · A · factor de viento
  var force = Cd * q * A * windFactor; // en Newtons
  
  // Construir el desglose de cálculos en HTML
  var breakdownHTML = "<h3>Datos Generales del Proyecto</h3>" +
                      "<p><strong>Nombre:</strong> " + projectName + "</p>" +
                      "<p><strong>Ubicación:</strong> " + projectLocation + "</p>" +
                      "<h3>Desglose de Factores de Viento</h3>" +
                      "<table>" +
                      "<tr><th>Parámetro</th><th>Valor</th><th>Fórmula</th></tr>" +
                      "<tr><td>Densidad del aire (ρ)</td><td>" + rho.toFixed(3) + " kg/m³</td><td>-</td></tr>" +
                      "<tr><td>Velocidad del viento (V)</td><td>" + windSpeed.toFixed(2) + " m/s</td><td>-</td></tr>" +
                      "<tr><td>Presión dinámica (q)</td><td>" + q.toFixed(2) + " Pa</td><td>0.5·ρ·V²</td></tr>" +
                      "<tr><td>Área efectiva (A)</td><td>" + A.toFixed(2) + " m²</td><td>Altura · Ancho</td></tr>" +
                      "<tr><td>Coeficiente de arrastre (Cd)</td><td>" + Cd.toFixed(2) + "</td><td>-</td></tr>" +
                      "<tr><td>Factor de viento</td><td>" + windFactor.toFixed(2) + "</td><td>-</td></tr>" +
                      "<tr><td><strong>Fuerza de viento (F)</strong></td><td><strong>" + force.toFixed(2) + " N</strong></td><td>Cd·q·A·Factor</td></tr>" +
                      "</table>" +
                      "<h3>Fórmula para calculo de viento</h3>" +
                      "<p style='text-align:center;'>$$F = C_d \\cdot \\left(\\frac{1}{2}\\,\\rho\\,V^2\\right) \\cdot A \\cdot \\text{factor}$$</p>";
  
  document.getElementById('results').innerHTML = breakdownHTML;
  MathJax.typeset();
  
  // Dibujar el gráfico en el canvas (disposición fija, sin escala real)
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar la antena como un rectángulo fijo
  var antennaWidth = 60;   // ancho fijo
  var antennaHeight = 30; // alto fijo
  var antennaX = (canvas.width - antennaWidth) / 2;
  var antennaY = canvas.height - antennaHeight - 20; // margen inferior
  
  ctx.fillStyle = "#333";
  ctx.fillRect(antennaX, antennaY, antennaWidth, antennaHeight);
  
  // Dibujar la flecha con longitud fija orientada según el ángulo
  var arrowStartX = antennaX + antennaWidth / 2;
  var arrowStartY = antennaY;
  var arrowLength = 100; // longitud fija
  var rad = (azimuth - 90) * Math.PI / 180;  // 0° = norte (flecha hacia arriba)
  var arrowEndX = arrowStartX + arrowLength * Math.cos(rad);
  var arrowEndY = arrowStartY + arrowLength * Math.sin(rad);
  
  ctx.beginPath();
  ctx.moveTo(arrowStartX, arrowStartY);
  ctx.lineTo(arrowEndX, arrowEndY);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Función para dibujar la punta de la flecha
  function drawArrowhead(context, x, y, angle, headLength) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x - headLength * Math.cos(angle - Math.PI/6),
                   y - headLength * Math.sin(angle - Math.PI/6));
    context.lineTo(x - headLength * Math.cos(angle + Math.PI/6),
                   y - headLength * Math.sin(angle + Math.PI/6));
    context.lineTo(x, y);
    context.fillStyle = "red";
    context.fill();
  }
  drawArrowhead(ctx, arrowEndX, arrowEndY, rad, 10);
  
  // Mostrar en el canvas el valor de la fuerza y el ángulo
  ctx.font = "14px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("F: " + force.toFixed(2) + " N, Ángulo: " + azimuth.toFixed(1) + "°",
               canvas.width / 2, antennaY - 10);
});

document.getElementById('printBtn').addEventListener('click', function() {
  window.print();
});
