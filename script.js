// Data challenge
const challenges = [
  {
    name: "Soal 1",
    file: "soal1.png",
    editor: "soal1/editor.html",
    colors: ["#A3EDF8", "#B565FF"],
  },
  {
    name: "Soal 2",
    file: "soal2.png",
    editor: "soal2/editor.html",
    colors: ["#745294", "#B6FF91"],
  },
  {
    name: "Soal 3",
    file: "soal3.png",
    editor: "soal3/editor.html",
    colors: ["#333333", "#3DA638"],
  },
  {
    name: "Soal 4",
    file: "soal4.png",
    editor: "soal4/editor.html",
    colors: ["#F8E2A5", "#FD3CA3", "#FF73BE"],
  },
  {
    name: "Soal 5",
    file: "soal5.png",
    editor: "soal5/editor.html",
    colors: ["#C1F8A5", "#FD3C3C"],
  },
  {
    name: "Soal 6",
    file: "soal6.png",
    editor: "soal6/editor.html",
    colors: ["#FD5454", "#FFE0E0"],
  },
  {
    name: "Soal 7",
    file: "soal7.png",
    editor: "soal7/editor.html",
    colors: ["#5528A5", "#6855BF", "#9E8DEC", "#FFE0E0"],
  },
  {
    name: "Soal 8",
    file: "soal8.png",
    editor: "soal8/editor.html",
    colors: ["#FF5CE9", "#6534BB"],
  },
  {
    name: "Soal 9",
    file: "soal9.png",
    editor: "soal9/editor.html",
    colors: ["#FF2F74", "#FFFFFF"],
  },
  {
    name: "Soal 10",
    file: "soal10.png",
    editor: "soal10/editor.html",
    colors: ["#FFECE2", "#693DEE"],
  },
  {
    name: "Soal 11",
    file: "soal11.png",
    editor: "soal11/editor.html",
    colors: ["#FFFFFF", "#000000"],
  },
  {
    name: "Soal 12",
    file: "soal12.png",
    editor: "soal12/editor.html",
    colors: ["#F8F8F8", "#333333"],
  },
  {
    name: "Soal 13",
    file: "soal13.png",
    editor: "soal13/editor.html",
    colors: ["#302B52", "#DFD4FF", "#1FFF0F"],
  },
  {
    name: "Soal 14",
    file: "soal14.png",
    editor: "soal14/editor.html",
    colors: ["#5C00FF", "#785FEE", "#C3FFE5"],
  },
  {
    name: "Soal 15",
    file: "soal15.png",
    editor: "soal15/editor.html",
    colors: ["#000000", "#161616", "#FC0100"],
  },
];

// Dropdown challenge
const select = document.getElementById("challengeSelect");
challenges.forEach((c, idx) => {
  const opt = document.createElement("option");
  opt.value = idx;
  opt.innerText = c.name;
  select.appendChild(opt);
});

const targetImg = document.getElementById("targetImg");
const imgOnly = document.getElementById("imgOnly");
const hexCodesDiv = document.getElementById("hexCodes");
const outputFrame = document.getElementById("outputFrame");

// DIFF PREVIEW LOGIC
const diffPreview = document.getElementById("diffPreview");
const userHalf = document.getElementById("userHalf");
const targetHalf = document.getElementById("targetHalf");
const diffLine = document.getElementById("diffLine");
const diffIndicator = document.getElementById("diffIndicator");
const diffInvertImg = document.getElementById("diffInvertImg");
const diffModeCheckbox = document.getElementById("diffMode");
const containerW = 400;

let targetX = containerW;
let currentX = containerW;
let isMouseInside = false;
let lastFrame = null;

// Update visual slider
function setSlider(x) {
  x = Math.round(Math.max(0, Math.min(containerW, x)));
  // Code output
  userHalf.style.clipPath = x <= 0 ? `inset(0 0 0 400px)`
    : x >= containerW ? `inset(0 0 0 0)`
    : `inset(0 ${containerW - x}px 0 0)`;
  // Target design
  targetHalf.style.clipPath = x <= 0 ? `inset(0 0 0 0)`
    : x >= containerW ? `inset(0 400px 0 0)`
    : `inset(0 0 0 ${x}px)`;
  // DIFF OVERLAY
  if (diffInvertImg.style.display !== "none") {
    diffInvertImg.style.clipPath = x <= 0 ? `inset(0 0 0 400px)`
      : x >= containerW ? `inset(0 0 0 0)`
      : `inset(0 ${containerW - x}px 0 0)`;
  }
  diffLine.style.left = x - 1 + "px";
  diffIndicator.style.left = `${x - 27}px`;
  diffIndicator.innerText = Math.round(x);
}


// Animasi smooth dari currentX menuju targetX
function animateSlider() {
  // Kecepatan animasi (0.12-0.25 makin besar makin cepat)
  currentX += (targetX - currentX) * 0.18;
  // Jika sudah dekat sekali, snap saja
  if (Math.abs(targetX - currentX) < 0.6) currentX = targetX;
  setSlider(currentX);
  if (currentX !== targetX) {
    lastFrame = requestAnimationFrame(animateSlider);
  } else {
    lastFrame = null;
  }
}

// Mouse move: slider akan bergerak smooth menuju posisi mouse
diffPreview.addEventListener("mousemove", (e) => {
  isMouseInside = true;
  const rect = diffPreview.getBoundingClientRect();
  let x = e.clientX - rect.left;
  targetX = Math.max(0, Math.min(containerW, x));
  if (!lastFrame) animateSlider();
});

// Mouse keluar: slider animasi ke kanan mentok
diffPreview.addEventListener("mouseleave", () => {
  isMouseInside = false;
  targetX = containerW;
  if (!lastFrame) animateSlider();
});

// Window resize, snap slider ke posisi terakhir
window.addEventListener("resize", () => {
  setSlider(currentX);
});

// Inisialisasi slider mentok kanan
setSlider(containerW);
currentX = containerW;
targetX = containerW;

// ===== FILTER DIFF =====
diffModeCheckbox.addEventListener("change", () => {
  diffInvertImg.style.display = diffModeCheckbox.checked ? "block" : "none";
});

// LOAD CHALLENGE
function loadChallenge(idx) {
  const chal = challenges[idx];
  const imgSrc = "../assets/" + chal.file;
  targetImg.src = imgSrc;
  imgOnly.src = imgSrc;
  outputFrame.src = "../challenges/" + chal.editor;
  diffInvertImg.src = imgSrc; // update src overlay diff
  hexCodesDiv.innerHTML = "";
  chal.colors.forEach((hex) => {
    const btn = document.createElement("button");
    btn.className = "hex-btn";
    btn.dataset.hex = hex;
    btn.innerHTML = `<span class="dot" style="background:${hex}"></span>${hex}`;
    btn.onclick = function () {
      navigator.clipboard.writeText(hex);
      btn.classList.add("copied");
      btn.innerHTML = `<span class="dot" style="background:${hex}"></span>Copied!`;
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = `<span class="dot" style="background:${hex}"></span>${hex}`;
      }, 1200);
    };
    hexCodesDiv.appendChild(btn);
  });
  // update state diff overlay saat load soal baru
  diffInvertImg.style.display = diffModeCheckbox.checked ? "block" : "none";
}

select.addEventListener("change", (e) => {
  loadChallenge(select.value);
});

// INIT
loadChallenge(0);
