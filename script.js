let entries = [];
let names = [];
let angles = [];
let wheelCanvas = document.getElementById("wheel");
let ctx = wheelCanvas.getContext("2d");
let currentAngle = 0;
let spinning = false;

function loadCSV() {
  const fileInput = document.getElementById("csvFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload a CSV file!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const csv = event.target.result;
    processCSV(csv);
  };

  reader.readAsText(file);
}

function processCSV(csv) {
  const rows = csv.split("\n");
  entries = [];
  names = [];
  angles = [];

  let entryListHTML = ""; // For displaying the list of entries
  let totalEntries = 0;

  for (let i = 1; i < rows.length; i++) {
    // Skip header
    const cols = rows[i].split(",");
    if (cols.length < 3) continue;

    const customerNumber = cols[0].trim();
    const customerName = cols[1].trim();
    const entryCount = parseInt(cols[2].trim());

    if (isNaN(entryCount)) continue; // Skip invalid entry counts

    const fullName = `${customerNumber} - ${customerName}`;

    // Store names and corresponding weights
    for (let j = 0; j < entryCount; j++) {
      entries.push(fullName);
    }

    totalEntries += entryCount;
    entryListHTML += `<li>${fullName} (x${entryCount})</li>`;
  }

  entryListHTML =
    `<li><strong>Total Entries: ${totalEntries}</strong></li>` + entryListHTML;
  document.getElementById("entryList").innerHTML = entryListHTML;

  generateWheel();
  alert("CSV Loaded Successfully! Entries added.");
}

function generateWheel() {
  const uniqueNames = [...new Set(entries)];
  const numEntries = uniqueNames.length;
  const anglePerSegment = 360 / numEntries;

  ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

  for (let i = 0; i < numEntries; i++) {
    angles.push(anglePerSegment * i);
    drawSegment(uniqueNames[i], i, anglePerSegment);
  }
}

function drawSegment(name, index, anglePerSegment) {
  const startAngle = (angles[index] * Math.PI) / 180;
  const endAngle = ((angles[index] + anglePerSegment) * Math.PI) / 180;
  const colors = [
    "#f44336",
    "#ff9800",
    "#ffeb3b",
    "#4caf50",
    "#2196f3",
    "#9c27b0",
  ];

  ctx.beginPath();
  ctx.moveTo(175, 175); // Centered
  ctx.arc(175, 175, 175, startAngle, endAngle);
  ctx.fillStyle = colors[index % colors.length];
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.translate(175, 175);
  ctx.rotate((angles[index] + anglePerSegment / 2) * (Math.PI / 180));
  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  ctx.fillText(name, -40, 5);
  ctx.restore();
}

function spinWheel() {
  if (spinning) return;

  spinning = true;
  const randomSpin = Math.floor(Math.random() * 360) + 1800; // Random big spin
  currentAngle += randomSpin;

  wheelCanvas.style.transition = "transform 4s ease-out";
  wheelCanvas.style.transform = `rotate(${currentAngle}deg)`;

  setTimeout(() => {
    determineWinner();
    spinning = false;
  }, 4000);
}

function determineWinner() {
  let winningAngle = (360 - (currentAngle % 360)) % 360;
  let segmentIndex = Math.floor((winningAngle / 360) * entries.length);
  let winnerName = entries[segmentIndex];

  document.getElementById("winner").innerText = `Winner: ${winnerName}`;
  showModal(winnerName);
}

function showModal(winnerName) {
  const modal = document.getElementById("winnerModal");
  const modalContent = document.getElementById("modalContent");
  modalContent.innerText = ` ${winnerName}`;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("winnerModal");
  modal.style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("winnerModal");
  if (event.target == modal) {
    closeModal();
  }
};
