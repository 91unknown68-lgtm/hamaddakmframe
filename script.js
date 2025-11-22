let userImage = document.getElementById("userImage");
let frame = document.getElementById("frame");

let posX = 0, posY = 0, scale = 1;
let isDragging = false;
let startX, startY;

document.getElementById("upload").addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (event) {
        userImage.src = event.target.result;
        resetTransform();
    };
    reader.readAsDataURL(file);
});

function resetTransform() {
    posX = 0;
    posY = 0;
    scale = 1;
    updateTransform();
}

function updateTransform() {
    userImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

document.addEventListener("mousedown", function (e) {
    if (e.target === userImage) {
        isDragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
    }
});

document.addEventListener("mousemove", function (e) {
    if (isDragging) {
        posX = e.clientX - startX;
        posY = e.clientY - startY;
        updateTransform();
    }
});

document.addEventListener("mouseup", function () {
    isDragging = false;
});

document.addEventListener("wheel", function (e) {
    if (e.target === userImage) {
        e.preventDefault();
        scale += e.deltaY * -0.001;
        if (scale < 0.2) scale = 0.2;
        if (scale > 5) scale = 5;
        updateTransform();
    }
});

document.getElementById("download").addEventListener("click", function () {

    let canvas = document.createElement("canvas");
    let size = 1080;
    canvas.width = size;
    canvas.height = size;

    let ctx = canvas.getContext("2d");

    let displaySize = document.querySelector(".frame-area").offsetWidth;
    let ratio = size / displaySize;

    let img = new Image();
    img.src = userImage.src;

    img.onload = function () {
        ctx.drawImage(
            img,
            posX * ratio,
            posY * ratio,
            img.width * scale * ratio,
            img.height * scale * ratio
        );

        let frameImg = new Image();
        frameImg.src = "hamaddakmframe.png";

        frameImg.onload = function () {
            ctx.drawImage(frameImg, 0, 0, size, size);

            let link = document.createElement("a");
            link.download = "final.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
    };
});