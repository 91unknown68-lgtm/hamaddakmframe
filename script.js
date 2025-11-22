const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download');
let userImg = new Image();
let frameImg = new Image();
let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false;
let startX, startY;
let initialDistance = 0;
let initialScale = 1;

// حجم الـ canvas المربع
const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// الإطار
frameImg.src = 'hamaddakmframe.png';

// رفع صورة المستخدم
upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        userImg.src = event.target.result;
        downloadBtn.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
});

// رسم الصورة والإطار مع الحفاظ على جودة الإطار الأصلية
function draw() {
    if (!userImg.complete || !frameImg.complete) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // حساب أبعاد الصورة مع الحفاظ على النسبة داخل المربع
    let ratio = Math.min(CANVAS_SIZE / userImg.width, CANVAS_SIZE / userImg.height);
    const w = userImg.width * ratio * imgScale;
    const h = userImg.height * ratio * imgScale;

    // رسم الصورة داخل الـ canvas
    ctx.drawImage(userImg, imgX + (CANVAS_SIZE - w)/2, imgY + (CANVAS_SIZE - h)/2, w, h);

    // رسم الإطار بجودة أصلية دون تشويه
    const frameRatio = Math.min(CANVAS_SIZE / frameImg.width, CANVAS_SIZE / frameImg.height);
    const frameW = frameImg.width * frameRatio;
    const frameH = frameImg.height * frameRatio;
    const frameX = (CANVAS_SIZE - frameW) / 2;
    const frameY = (CANVAS_SIZE - frameH) / 2;
    ctx.drawImage(frameImg, frameX, frameY, frameW, frameH);
}

// تحميل الصورة
downloadBtn.addEventListener('click', () => {
    draw();
    const link = document.createElement('a');
    link.download = 'my-framed-photo.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});

// تحريك الصورة بالماوس
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.offsetX - imgX;
    startY = e.offsetY - imgY;
});
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        imgX = e.offsetX - startX;
        imgY = e.offsetY - startY;
        draw();
    }
});
canvas.addEventListener('mouseup', () => isDragging = false);
canvas.addEventListener('mouseleave', () => isDragging = false);

// التكبير/التصغير بعجلة الماوس
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    imgScale += e.deltaY * -0.001;
    if (imgScale < 0.1) imgScale = 0.1;
    if (imgScale > 5) imgScale = 5;
    draw();
});

// دعم اللمس للموبايل
canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.touches[0].clientX - rect.left - imgX;
        startY = e.touches[0].clientY - rect.top - imgY;
    } else if (e.touches.length === 2) {
        isDragging = false;
        initialDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = imgScale;
    }
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    if (e.touches.length === 1 && isDragging) {
        imgX = e.touches[0].clientX - rect.left - startX;
        imgY = e.touches[0].clientY - rect.top - startY;
        draw();
    } else if (e.touches.length === 2) {
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        imgScale = initialScale * (currentDistance / initialDistance);
        draw();
    }
});
canvas.addEventListener('touchend', () => {
    isDragging = false;
});

userImg.onload = draw;
frameImg.onload = draw;