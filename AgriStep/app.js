// =================================================================
// AgriStep: Object-Oriented Architecture (OOP)
// =================================================================

// 1. Abstraction: Masks weather API & soil filtering logic[cite: 1]
class ClimateAnalyzer {
  static fetchSuitableCrops(environmentKey) {
    const philippineCropDatabase = [
      { name: "Talong (Eggplant)", idealEnv: ["rich-dry", "rich-wet"] },
      { name: "Ampalaya (Bitter Gourd)", idealEnv: ["rich-dry", "sticky-clay"] },
      { name: "Sitao (Yardlong Bean)", idealEnv: ["rich-dry", "rich-wet", "sandy"] },
      { name: "Kangkong (Water Spinach)", idealEnv: ["rich-wet", "sticky-clay"] },
      { name: "Kamatis (Tomato)", idealEnv: ["rich-dry", "sticky-clay"] },
      { name: "Okra", idealEnv: ["rich-dry", "rich-wet", "sandy"] }
    ];

    return philippineCropDatabase.filter(crop => crop.idealEnv.includes(environmentKey));
  }
}

// 2. Inheritance: Base CareTask and specialized subclasses[cite: 1]
class CareTask {
  constructor(title, day, cropName) {
    this.title = title;
    this.day = day;
    this.cropName = cropName;
    this.isCompleted = false;
  }

  generateCareInstructions() {
    return `Take simple daily care of your ${this.cropName}.`;
  }
}

class SowingTask extends CareTask {
  constructor(day, cropName, depth) {
    super("Plant Seeds", day, cropName);
    this.depth = depth;
  }

  generateCareInstructions() {
    return `Push ${this.cropName} seeds about ${this.depth} deep into the soft soil[cite: 1].`;
  }
}

class MaintenanceTask extends CareTask {
  constructor(day, cropName, waterVolume, action) {
    super("Water & Feed", day, cropName);
    this.waterVolume = waterVolume;
    this.action = action;
  }

  // Polymorphism: Crop-specific maintenance instructions[cite: 1]
  generateCareInstructions() {
    if (this.cropName.includes("Talong")) {
      return `Pinch off old bottom leaves to keep bugs away, then pour ${this.waterVolume} of water near the stem[cite: 1].`;
    } else if (this.cropName.includes("Ampalaya")) {
      return `Tie climbing stems to a bamboo trellis and pour ${this.waterVolume} of water[cite: 1].`;
    } else if (this.cropName.includes("Sitao")) {
      return `Tie vines to a wooden stick for support and give ${this.waterVolume} of water[cite: 1].`;
    } else if (this.cropName.includes("Kangkong")) {
      return `Keep the dirt wet with ${this.waterVolume} of water. Cut upper leaves to eat—they will regrow!`;
    } else if (this.cropName.includes("Kamatis")) {
      return `Pinch off extra side shoots and tie the main stem to a stick[cite: 1].`;
    }
    return `${this.action} and pour ${this.waterVolume} of water[cite: 1].`;
  }
}

// PestControlTask Subclass[cite: 1]
class PestControlTask extends CareTask {
  constructor(day, cropName, warningSigns, safeRecipe) {
    super("Pest Control Check", day, cropName);
    this.warningSigns = warningSigns;
    this.safeRecipe = safeRecipe;
  }

  // Polymorphism: Specialized pest control warning and organic recipe output[cite: 1]
  generateCareInstructions() {
    return `Watch for: ${this.warningSigns}. Remedy: ${this.safeRecipe}`;
  }
}

// 3. Encapsulation: GridCell controls private state changes[cite: 1]
class GridCell {
  #status; // Encapsulated status variable[cite: 1]

  constructor(id) {
    this.id = id;
    this.crop = null;
    this.#status = "Empty Dirt";
    this.tasks = [];
  }

  getStatus() {
    return this.#status;
  }

  plant(crop) {
    this.crop = crop;
    this.#status = "Seeds Planted";
    
    // Dynamically generate task pipeline using inherited task classes[cite: 1]
    this.tasks = [
      new SowingTask("Day 1", crop.name, "1 finger knuckle"),
      new MaintenanceTask("Day 3", crop.name, "1 cup", "Water gently early in the morning"),
      new MaintenanceTask("Day 15", crop.name, "2 cups", "Mix in natural compost dirt food"),
      new PestControlTask("Day 25", crop.name, "tiny holes or yellow spots under leaves", "spray soapy water or neem oil[cite: 1]"),
      new MaintenanceTask("Day 40", crop.name, "2 cups", "Check if fruits or leaves are big and ready")
    ];
  }

  // Reset or harvest cell plot
  clearPlot() {
    this.crop = null;
    this.#status = "Empty Dirt";
    this.tasks = [];
  }

  // Calculate task completion percentage
  getCompletionPercentage() {
    if (this.tasks.length === 0) return 0;
    const completed = this.tasks.filter(t => t.isCompleted).length;
    return Math.round((completed / this.tasks.length) * 100);
  }

  // Toggle checklist tasks and update private state safely[cite: 1]
  toggleTaskComplete(index) {
    if (this.tasks[index]) {
      this.tasks[index].isCompleted = !this.tasks[index].isCompleted;
      
      const completedCount = this.tasks.filter(t => t.isCompleted).length;
      
      if (completedCount === 0) {
        this.#status = "Seeds Planted";
      } else if (completedCount === this.tasks.length) {
        this.#status = "Ready to Pick!";
      } else {
        this.#status = "Growing Well";
      }
    }
  }
}

// =================================================================
// UI Controller Logic
// =================================================================

const gridCells = Array.from({ length: 9 }, (_, i) => new GridCell(i));
let selectedCrop = null;
let activeSelectedCell = null;

// DOM Elements
const locationSelect = document.getElementById("location-select");
const analyzeBtn = document.getElementById("analyze-btn");
const cropBox = document.getElementById("crop-recommendations");
const gridContainer = document.getElementById("grid-container");
const cellInfo = document.getElementById("active-cell-info");
const taskList = document.getElementById("task-list");
const clearPlotBtn = document.getElementById("clear-plot-btn");
const progressContainer = document.getElementById("progress-container");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const statPlanted = document.getElementById("stat-planted");
const statReady = document.getElementById("stat-ready");

// 1. Analyze Environment (Abstraction)
analyzeBtn.addEventListener("click", () => {
  const suitableCrops = ClimateAnalyzer.fetchSuitableCrops(locationSelect.value);
  cropBox.innerHTML = "";
  
  if (suitableCrops.length === 0) {
    cropBox.innerHTML = "<span style='font-size:0.8rem; color:#888;'>No crops match this soil selection.</span>";
    return;
  }

  suitableCrops.forEach((crop, index) => {
    const chip = document.createElement("span");
    chip.className = "crop-chip";
    chip.innerText = `🇵🇭 ${crop.name}`;
    chip.addEventListener("click", () => {
      document.querySelectorAll(".crop-chip").forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      selectedCrop = crop;
    });
    cropBox.appendChild(chip);
    if (index === 0) chip.click();
  });
});

// 2. Render Spatial Plot Grid & Mini Stats Dashboard
function renderGrid() {
  gridContainer.innerHTML = "";
  
  gridCells.forEach(cell => {
    const cellEl = document.createElement("div");
    const isHarvestReady = cell.getStatus() === "Ready to Pick!";
    cellEl.className = `grid-cell ${cell.crop ? 'planted' : ''} ${isHarvestReady ? 'harvest-ready' : ''}`;
    
    cellEl.innerHTML = `
      <strong>${cell.crop ? cell.crop.name.split(' ')[0] : `Plot ${cell.id + 1}`}</strong>
      <span class="cell-status">${cell.getStatus()}</span>
      ${cell.crop ? `<span class="cell-mini-progress">${cell.getCompletionPercentage()}%</span>` : ''}
    `;
    cellEl.addEventListener("click", () => handleCellClick(cell));
    gridContainer.appendChild(cellEl);
  });

  updateDashboardStats();
}

function updateDashboardStats() {
  const plantedCount = gridCells.filter(c => c.crop !== null).length;
  const readyCount = gridCells.filter(c => c.getStatus() === "Ready to Pick!").length;
  
  statPlanted.innerText = plantedCount;
  statReady.innerText = readyCount;
}

function handleCellClick(cell) {
  activeSelectedCell = cell;

  if (!cell.crop) {
    if (!selectedCrop) {
      alert("Please analyze soil and tap a crop first!");
      return;
    }
    cell.plant(selectedCrop);
    renderGrid();
  }
  
  renderTasks(cell);
  renderAllPlantedTips();
}

// 3. Render Interactive Task Checklist & Progress Bar
function renderTasks(cell) {
  cellInfo.innerText = `Plot ${cell.id + 1}: ${cell.crop ? cell.crop.name : "Empty Plot"} [${cell.getStatus()}]`;
  taskList.innerHTML = "";

  if (!cell.crop) {
    taskList.innerHTML = "<li style='font-size:0.8rem; color:#666;'>Select a planted plot to view tasks.</li>";
    clearPlotBtn.style.display = "none";
    progressContainer.style.display = "none";
    return;
  }

  // Show action controls
  clearPlotBtn.style.display = "block";
  progressContainer.style.display = "flex";
  
  const percentage = cell.getCompletionPercentage();
  progressFill.style.width = `${percentage}%`;
  progressText.innerText = `${percentage}% Complete`;

  cell.tasks.forEach((task, index) => {
    const isPest = task instanceof PestControlTask;
    const li = document.createElement("li");
    li.className = `task-item ${task.isCompleted ? 'completed' : ''} ${isPest ? 'pest-task' : ''}`;
    
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.isCompleted ? 'checked' : ''}>
      <div class="task-content">
        <div class="task-title">[${task.day}] ${task.title}</div>
        <div class="task-desc">${task.generateCareInstructions()}</div>
      </div>
    `;
    
    li.addEventListener("click", () => {
      cell.toggleTaskComplete(index);
      renderGrid();
      renderTasks(cell);
    });

    taskList.appendChild(li);
  });
}

// Harvest / Reset Plot Event Handler
clearPlotBtn.addEventListener("click", () => {
  if (activeSelectedCell && activeSelectedCell.crop) {
    const confirmReset = confirm(`Do you want to harvest or clear Plot ${activeSelectedCell.id + 1}?`);
    if (confirmReset) {
      activeSelectedCell.clearPlot();
      renderGrid();
      renderTasks(activeSelectedCell);
      renderAllPlantedTips();
    }
  }
});

// 4. Multi-Plant Care & Easy Bug Control Tips
function renderAllPlantedTips() {
  const tipsContainer = document.getElementById("tips-content");
  if (!tipsContainer) return;

  const plantedCrops = [...new Set(
    gridCells.filter(cell => cell.crop !== null).map(cell => cell.crop.name)
  )];

  if (plantedCrops.length === 0) {
    if (selectedCrop) {
      plantedCrops.push(selectedCrop.name);
    } else {
      tipsContainer.innerHTML = "<div class='instruction'>Plant crops on your grid to view crop care and bug control tips!</div>";
      return;
    }
  }

  const masterTipsDatabase = {
    "Talong (Eggplant)": {
      care: [
        "Dirt Tip: Plant in soft garden dirt that lets water drain easily.",
        "Spacing: Keep plants spaced out so roots don't fight for food.",
        "Pruning: Cut off old yellow leaves at the bottom so the plant grows bigger eggplants."
      ],
      pest: "🐛 Bug Control: Mix a few drops of dish soap in a spray bottle of water. Spray under leaves if bugs start eating them."
    },
    "Ampalaya (Bitter Gourd)": {
      care: [
        "Dirt Tip: Grows great in soft dirt or loosened clay mud.",
        "Support: Build a simple bamboo ladder (trellis) so climbing stems grow upward."
      ],
      pest: "🐛 Bug Control: Wrap young bitter gourds in old newspaper or paper bags to stop fruit flies from poking holes in them."
    },
    "Sitao (Yardlong Bean)": {
      care: [
        "Dirt Tip: Grows very fast, even in loose sandy beach dirt.",
        "Thinning: Remove tiny extra sprouts so main plants have room to grow."
      ],
      pest: "🐛 Bug Control: Look out for tiny black bugs (aphids). Spray them off with a gentle stream of water or soapy water."
    },
    "Kangkong (Water Spinach)": {
      care: [
        "Dirt Tip: Loves rainy weather and wet muddy soil!",
        "Harvesting: Snip stems 2 inches above the dirt so new leaves regrow over and over."
      ],
      pest: "🐛 Bug Control: Check leaves every morning for caterpillars and pick them off with your fingers."
    },
    "Kamatis (Tomato)": {
      care: [
        "Dirt Tip: Loves soft, nutrient-rich dirt and full sunshine.",
        "Pruning: Pinch off small extra side branches and tie the main stem to a wooden stick.",
        "Watering: Pour water at the bottom roots, not directly on the leaves."
      ],
      pest: "🐛 Bug Control: Dust wood ash or spray mild soapy water if tiny white bugs appear under leaves."
    },
    "Okra": {
      care: [
        "Dirt Tip: Super tough plant! Grows well in almost any garden dirt or sunny plot.",
        "Harvesting: Pick the green okra pods while they are small and soft."
      ],
      pest: "🐛 Bug Control: Look under leaves for bug egg clusters and wipe them away using a damp cloth."
    }
  };

  let htmlOutput = "";
  plantedCrops.forEach(cropName => {
    const cropData = masterTipsDatabase[cropName] || {
      care: ["Keep soil moist and remove weeds around your plot."],
      pest: "🐛 Bug Control: Check leaves daily for tiny holes or insects."
    };

    htmlOutput += `
      <div class="crop-tip-card">
        <strong class="crop-tip-title">🌱 Tips for ${cropName}</strong>
        <ul class="tip-list">
          ${cropData.care.map(tip => `<li>${tip}</li>`).join("")}
        </ul>
        <div class="pest-tip-box">${cropData.pest}</div>
      </div>
    `;
  });

  tipsContainer.innerHTML = htmlOutput;
}

// Initialize Application
analyzeBtn.click();
renderGrid();
renderAllPlantedTips();