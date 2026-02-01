let currentTheme = 'dark';
let userClan = '';

function setTheme(theme) {
    currentTheme = theme;
    if(theme === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
    showScreen('screen-reg');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    if(screenId === 'screen-draw') initCanvas();
}

// РИСОВАЛКА
function initCanvas() {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let painting = false;
    let color = 'black';

    canvas.onmousedown = () => painting = true;
    canvas.onmouseup = () => { painting = false; ctx.beginPath(); };
    canvas.onmousemove = (e) => {
        if (!painting) return;
        ctx.lineWidth = document.getElementById('brushSize').value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    };
    window.setColor = (c) => color = c;
}

function selectClan(emoji) {
    userClan = emoji;
    document.getElementById('user-name').innerText = document.getElementById('reg-nick').value + " " + userClan;
    showScreen('screen-main');
}

function openPostModal() {
    const msg = prompt("Что скажешь? (ИБО)");
    if(msg) {
        const post = document.createElement('div');
        post.className = 'post';
        post.style = "padding:20px; border-bottom:1px solid #333; width:100%";
        post.innerHTML = `<b>${document.getElementById('reg-nick').value}</b>: ${msg}`;
        document.getElementById('feed').prepend(post);
    }
}
