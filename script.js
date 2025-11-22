const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const frame = document.getElementById("frame");
const downloadBtn = document.getElementById("downloadBtn");

canvas.width = 1080;
canvas.height = 1080;

let img = new Image();
let imgX = 0, imgY = 0, imgW = 1080, imgH = 1080;
let scale = 1;
let isDragging = false;
let startX = 0, startY = 0;
let imgLoaded = false;

upload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        img = new Image();
        img.onload = () => {
            imgLoaded = true;
            fitImage();
            draw();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function fitImage() {
    const aspect = img.width / img.height;
    if (aspect > 1) {
        imgW = 1080;
        imgH = 1080 / aspect;
    } else {
        imgH = 1080;
        imgW = 1080 * aspect;
    }
    imgX = (1080 - imgW) / 2;
    imgY = (1080 - imgH) / 2;
    scale = 1;
}

function draw() {
    ctx.clearRect(0, 0, 1080, 1080);
    if (imgLoaded) {
        ctx.drawImage(img, imgX, imgY, imgW * scale, imgH * scale);
    }
    ctx.drawImage(frame, 0, 0, 1080, 1080);
}

canvas.addEventListener("mousedown", e => {
    if (!imgLoaded) return;
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
});
canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mousemove", e => {
    if (!isDragging) return;
    const dx = e.offsetX - startX;
    const dy = e.offsetY - startY;
    imgX += dx;
    imgY += dy;
    startX = e.offsetX;
    startY = e.offsetY;
    draw();
});

canvas.addEventListener("wheel", e => {
    if (!imgLoaded) return;
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    scale += delta;
    if (scale < 0.2) scale = 0.2;
    if (scale > 5) scale = 5;
    draw();
});

downloadBtn.addEventListener("click", () => {
    if (!imgLoaded) return;
    const link = document.createElement("a");
    link.download = "framed.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
});