const upload = document.getElementById("upload");
const userImage = document.getElementById("userImage");
const frame = document.getElementById("frame");
const downloadBtn = document.getElementById("downloadBtn");

let scale = 1;
let posX = 0;
let posY = 0;

let isDragging = false;
let startX, startY;

upload.onchange = function () {
    const file = upload.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        userImage.src = e.target.result;
        userImage.style.display = "block";
        downloadBtn.style.display = "inline-block";

        scale = 1;
        posX = 0;
        posY = 0;
        userImage.style.transform = `translate(0px, 0px) scale(1)`;
    };
    reader.readAsDataURL(file);
};

// سحب الصورة
userImage.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX - posX;
    startY = e.touches[0].clientY - posY;
});

userImage.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    posX = e.touches[0].clientX - startX;
    posY = e.touches[0].clientY - startY;
    userImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
});

userImage.addEventListener("touchend", () => {
    isDragging = false;
});

// تكبير/تصغير الصورة بالـ pinch
let initialDistance = 0;

userImage.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
        let dx = e.touches[0].clientX - e.touches[1].clientX;
        let dy = e.touches[0].clientY - e.touches[1].clientY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (initialDistance !== 0) {
            let delta = dist - initialDistance;
            scale += delta * 0.002;
            if (scale < 0.3) scale = 0.3;
            if (scale > 5) scale = 5;

            userImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
        }

        initialDistance = dist;
    }
});

userImage.addEventListener("touchend", () => {
    initialDistance = 0;
});

// حفظ الجودة العالية
downloadBtn.onclick = function () {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;

    const ctx = canvas.getContext("2d");

    const frameImg = new Image();
    frameImg.src = frame.src;

    const userImg = new Image();
    userImg.src = userImage.src;

    Promise.all([
        new Promise((res) => (frameImg.onload = res)),
        new Promise((res) => (userImg.onload = res)),
    ]).then(() => {
        const scaleFactor = userImg.width / 320;

        ctx.drawImage(
            userImg,
            -posX * scaleFactor,
            -posY * scaleFactor,
            userImg.width * scale,
            userImg.height * scale
        );

        ctx.drawImage(frameImg, 0, 0, 1080, 1080);

        const link = document.createElement("a");
        link.download = "framed.png";
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
    });
};