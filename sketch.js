let table;
let rivers = [];
let continents = {};
let continentColors;

function preload() {
  // Caricamento del dataset
  table = loadTable('data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  textFont('Helvetica, Arial, sans-serif'); // Font leggibile

  // Estrarre i dati dal CSV
  for (let i = 0; i < table.getRowCount(); i++) {
    let name = table.getString(i, 'name');
    let continent = table.getString(i, 'continent');
    let length = table.getNum(i, 'length');
    let area = table.getNum(i, 'area');
    let avgTemp = table.getNum(i, 'avg_temp');

    let river = { name, continent, length, area, avgTemp };
    rivers.push(river);

    // Raggruppare per continente
    if (!continents[continent]) {
      continents[continent] = [];
    }
    continents[continent].push(river);
  }

  // Usare colori primari per i continenti
  continentColors = [
    color(255, 0, 0),   // Rosso
    color(0, 255, 0),   // Verde
    color(0, 0, 255),   // Blu
    color(255, 255, 0), // Giallo
    color(255, 165, 0), // Arancione
    color(128, 0, 128), // Viola
    color(0, 255, 255)  // Azzurro per l'Oceania
  ];
}

function draw() {
  background(255); // Sfondo bianco

  // Disegnare i bordi della rappresentazione
  noFill();
  stroke(0); // Bordi neri
  strokeWeight(2);
  rect(50, 50, width - 100, height - 100);

  let xOffset = 250; // Spazio per i glifi dei fiumi
  let yOffset = 100;
  let ySpacing = (height - 200) / Object.keys(continents).length; // Altezza per ogni continente
  let tooltipRiver = null; // Salva il fiume attualmente sotto il mouse

  textSize(16);
  textAlign(LEFT, CENTER);

  // Disegnare i glifi per ciascun continente
  Object.keys(continents).forEach((continent, index) => {
    let riversInContinent = continents[continent];
    let yBase = yOffset + index * ySpacing;

    // Nome del continente sempre visibile in primo piano
    push();
    fill(255); // Sfondo bianco per il nome del continente
    noStroke();
    let textWidthVal = textWidth(continent.toUpperCase());
    rect(90, yBase - 12, textWidthVal + 20, 24); // Rettangolo di sfondo

    fill(0); // Colore del testo
    textStyle(BOLD);
    textSize(18);
    textAlign(LEFT, CENTER);
    // Modifica per i nomi dei continenti
    let formattedContinent = continent === 'North America' ? 'N.AMERICA' :
                             continent === 'South America' ? 'S.AMERICA' :
                             continent;
    text(formattedContinent.toUpperCase(), 100, yBase);
    pop();

    // Disegnare i glifi per ciascun fiume
    let xSpacing = (width - 350) / riversInContinent.length; // Spazio tra gli oblò
    let radius = calculateRadius(riversInContinent); // Ridimensionare i pallini

    riversInContinent.forEach((river, i) => {
      let x = xOffset + i * xSpacing;
      let y = yBase;

      let waterLevel = map(river.length, 0, maxLength(), 0, radius); // Livello dell'acqua

      // Colore specifico per il continente
      let colorIndex = Object.keys(continents).indexOf(continent) % continentColors.length;
      let continentColor = continent === 'Oceania' ? continentColors[6] : continentColors[colorIndex]; // Colore Oceania

      // Disegnare l'oblò
      fill(255);
      stroke(continentColor);
      strokeWeight(2);
      ellipse(x, y, radius * 2);

      // Livello dell'acqua
      fill(continentColor);
      noStroke();
      arc(x, y, radius * 2, radius * 2, PI, PI + radians(map(waterLevel, 0, radius, 0, 180)));

      // Controllare se il mouse è sopra l'oblò
      if (dist(mouseX, mouseY, x, y) < radius) {
        tooltipRiver = { river, x, y };
      }
    });
  });

  // Disegnare il tooltip in cima a tutto
  if (tooltipRiver) {
    drawTooltip(tooltipRiver.river, mouseX, mouseY);
  }
}

function maxArea() {
  return Math.max(...rivers.map(r => r.area));
}

function maxLength() {
  return Math.max(...rivers.map(r => r.length));
}

function calculateRadius(riversInContinent) {
  let maxRadius = 40;
  let minRadius = 10;
  let availableWidth = (width - 350) / riversInContinent.length;
  return constrain(availableWidth / 2 - 10, minRadius, maxRadius);
}

function drawTooltip(river, x, y) {
  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(x, y, 220, 100, 5);

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);

  text(`Name: ${river.name}`, x + 10, y + 10);
  text(`Length: ${river.length} km`, x + 10, y + 30);
  text(`Area: ${river.area} km²`, x + 10, y + 50);
  text(`Avg Temp: ${river.avgTemp}°C`, x + 10, y + 70);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
