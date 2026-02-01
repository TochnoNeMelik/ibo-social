let app = {
    user: JSON.parse(localStorage.getItem('ibo_user')) || null,
    posts: JSON.parse(localStorage.getItem('ibo_posts')) || [],
    brushColor: '#000',
    recorder: null,
    chunks: [],
    audioBlob: null,
    tempClan: '🔥'
};

window.onload = () => {
    if (app.user) {
        document.getElementById('screen-theme').classList.add('hidden');
        initApp();
    }
};

// ТЕМА
function setTheme(t) {
    if(t === 'light') document.body.classList.add('light');
    showScreen('screen-auth');
}

// РИСОВАНИЕ
function initCanvas() {
    const canvas = document.getElementById('paintCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.onmousedown = () => drawing = true;
    canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
    canvas.onmousemove = (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = document.getElementById('brushSize').value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = app.brushColor;
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };
}
function setColor(c) { app.brushColor = c; }

// РЕГИСТРАЦИЯ
function setClan(c) { app.tempClan = c; alert('Выбран клан ' + c); }

function finishRegistration() {
    const canvas = document.getElementById('paintCanvas');
    app.user = {
        name: document.getElementById('reg-nick').value,
        clan: app.tempClan,
        ava: canvas.toDataURL(),
        email: document.getElementById('reg-email').value
    };
    localStorage.setItem('ibo_user', JSON.stringify(app.user));
    initApp();
    showScreen('screen-main');
}

// ГОЛОС (НАСТОЯЩИЙ)
async function startMic() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    app.recorder = new MediaRecorder(stream);
    app.chunks = [];
    app.recorder.ondataavailable = e => app.chunks.push(e.data);
    app.recorder.onstop = () => {
        const blob = new Blob(app.chunks, { type: 'audio/ogg; codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => { app.audioBlob = reader.result; };
        document.getElementById('mic-status').innerText = "✅ Записано!";
    };
    app.recorder.start();
    document.getElementById('mic-status').innerText = "🔴 Запись...";
    document.getElementById('mic-btn').onclick = stopMic;
}

function stopMic() {
    app.recorder.stop();
    document.getElementById('mic-btn').onclick = startMic;
}
document.getElementById('mic-btn').onclick = startMic;

// ПОСТЫ
function publishPost() {
    const text = document.getElementById('post-text').value;
    const post = {
        name: app.user.name,
        ava: app.user.ava,
        clan: app.user.clan,
        text: text,
        audio: app.audioBlob,
        id: Date.now()
    };
    app.posts.unshift(post);
    localStorage.setItem('ibo_posts', JSON.stringify(app.posts));
    renderFeed();
    closePostModal();
    app.audioBlob = null;
}

function renderFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = app.posts.map(p => `
        <div class="post-card">
            <div class="post-header">
                <img src="${p.ava}">
                <div><b>${p.name}</b> <span>${p.clan}</span></div>
            </div>
            <div>${p.text}</div>
            ${p.audio ? `<div class="voice-msg"><audio src="${p.audio}" controls></audio></div>` : ''}
        </div>
    `).join('');
}

function initApp() {
    document.getElementById('nav-avatar-display').innerHTML = `<img src="${app.user.ava}" style="width:100%">`;
    document.getElementById('p-avatar').src = app.user.ava;
    document.getElementById('p-name').innerText = app.user.name;
    document.getElementById('p-clan').innerText = 'Клан: ' + app.user.clan;
    document.getElementById('p-post-count').innerText = app.posts.length;
    renderFeed();
}

function showScreen(id) {
    document.querySelectorAll('.overlay, .content').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'screen-draw') initCanvas();
}
function openPostModal() { document.getElementById('modal-ibo').classList.remove('hidden'); }
function closePostModal() { document.getElementById('modal-ibo').classList.add('hidden'); }
