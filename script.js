const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download');

let userImg = new Image();
let frameImg = new Image();
let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false;
let startX, startY;

// رابط الإطار (تأكدي اسمه بالضبط)
frameImg.src = 'hamaddakmfarme.png';

// تعيين أبعاد الكانفاس ثابتة (مربع)
canvas.width = 400;
canvas.height = 400;

// لما المستخدم يرفع صورة
upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        userImg.src = event.target.result;
        downloadBtn.style.display = 'inline-block'; // يظهر الزر بعد رفع الصورة
    };
    reader.readAsDataURL(file);
});

// رسم الصورة والإطار على الكانفاس
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

// التحكم بالسحب
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

// التحكم بالتكبير/التصغير بعجلة الماوس
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    imgScale += e.deltaY * -0.001;
    if (imgScale < 0.1) imgScale = 0.1;
    if (imgScale > 5) imgScale = 5;
    draw();
});

// تحميل الصورة
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'my-framed-photo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});