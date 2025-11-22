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

// الكانفاس كبير للحفاظ على الجودة
canvas.width = 1200;
canvas.height = 1200;

// اسم الإطار مضبوط
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

// رسم الصورة والإطار
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (userImg.complete) {
        const w = userImg.width * imgScale;
        const h = userImg.height * imgScale;
        ctx.drawImage(userImg, imgX, imgY, w, h);
    }
    if (frameImg.complete) {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    }
}

frameImg.onload = draw;
userImg.onload = draw;

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

// دعم اللمس للموبايل (سحب + pinch zoom)
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

// تحميل الصورة مع الإطار بأقصى جودة
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'my-framed-photo.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});