const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("downloadBtn");

canvas.width = 1000; // جودة عالية للتحم يل
canvas.height = 1000;

let img = new Image();
let frame = new Image();
frame.src = "hamaddakmframe.png";

let imgX = 0, imgY = 0, imgW = 1000, imgH = 1000;
let isDragging = false;
let lastX = 0, lastY = 0;

upload.onchange = function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        img = new Image();
        img.onload = function () {
            fitImageInsideFrame();
            draw();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
};

function fitImageInsideFrame() {
    const aspect = img.width / img.height;

    // الإطار مربع دائمًا
    if (aspect > 1) {
        imgW = 1000;
        imgH = 1000 / aspect;
    } else {
        imgH = 1000;
        imgW = 1000 * aspect;
    }

    imgX = (1000 - imgW) / 2;
    imgY = (1000 - imgH) / 2;
}

canvas.addEventListener("mousedown", e => {
    isDragging = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener("mouseup", () => (isDragging = false));

canvas.addEventListener("mousemove", e => {
    if (!isDragging) return;

    let dx = (e.offsetX - lastX) * 2.5; 
    let dy = (e.offsetY - lastY) * 2.5;

    imgX += dx;
    imgY += dy;

    lastX = e.offsetX;
    lastY = e.offsetY;

    draw();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, imgX, imgY, imgW, imgH);
    ctx.drawImage(frame, 0, 0, 1000, 1000);
}

downloadBtn.onclick = function () {
    const link = document.createElement("a");
    link.download = "framed.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
};