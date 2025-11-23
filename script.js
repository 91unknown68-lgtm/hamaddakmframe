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

// حجم العرض على الصفحة (مربع)
const CANVAS_DISPLAY_SIZE = 500;
const CANVAS_SCALE = 3;

// ضبط الـ canvas الداخلي للحصول على جودة أعلى
canvas.width = CANVAS_DISPLAY_SIZE * CANVAS_SCALE;
canvas.height = CANVAS_DISPLAY_SIZE * CANVAS_SCALE;
canvas.style.width = CANVAS_DISPLAY_SIZE + 'px';
canvas.style.height = CANVAS_DISPLAY_SIZE + 'px';

// الإطار
frameImg.src = 'hamaddakmframe.png';

// رفع صورة المستخدم وتحويلها إلى PNG وتصحيح الاتجاه
upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const tempImg = new Image();
        tempImg.onload = function() {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = tempImg.width;
            tempCanvas.height = tempImg.height;
            tempCtx.drawImage(tempImg, 0, 0);
            userImg.src = tempCanvas.toDataURL('image/png');
            downloadBtn.style.display = 'inline-block';
        };
        tempImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// رسم الصورة والإطار بجودة عالية
function draw() {
    if (!userImg.complete || !frameImg.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // أبعاد الصورة داخل المربع مع الحفاظ على النسبة
    let ratio = Math.min(canvas.width / userImg.width, canvas.height / userImg.height);
    const w = userImg.width * ratio * imgScale;
    const h = userImg.height * ratio * imgScale;
    ctx.drawImage(userImg, imgX + (canvas.width - w)/2, imgY + (canvas.height - h)/2, w, h);

    // رسم الإطار بجودة أصلية عالية
    const frameRatio = Math.min(canvas.width / frameImg.width, canvas.height / frameImg.height);
    const frameW = frameImg.width * frameRatio;
    const frameH = frameImg.height * frameRatio;
    const frameX = (canvas.width - frameW) / 2;
    const frameY = (canvas.height - frameH) / 2;
    ctx.drawImage(frameImg, frameX, frameY, frameW, frameH);
}

// تحميل الصورة باستخدام Blob لتجنب مشاكل Page can't be loaded
downloadBtn.addEventListener('click', () => {
    draw();
    canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.download = 'my-framed-photo.png';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    }, 'image/png', 1.0);
});

// تحريك الصورة بالماوس
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.offsetX * CANVAS_SCALE - imgX;
    startY = e.offsetY * CANVAS_SCALE - imgY;
});
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        imgX = e.offsetX * CANVAS_SCALE - startX;
        imgY = e.offsetY * CANVAS_SCALE - startY;
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
        startX = (e.touches[0].clientX - rect.left) * CANVAS_SCALE - imgX;
        startY = (e.touches[0].clientY - rect.top) * CANVAS_SCALE - imgY;
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
        imgX = (e.touches[0].clientX - rect.left) * CANVAS_SCALE - startX;
        imgY = (e.touches[0].clientY - rect.top) * CANVAS_SCALE - startY;
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