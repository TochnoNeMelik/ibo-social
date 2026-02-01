let user = JSON.parse(localStorage.getItem('user')) || null;
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let clan = '🔥', color = '#000', drawing = false, recorder, chunks = [], audioURL = null;

// ИНИЦИАЛИЗАЦИЯ
if(user) {
    document.getElementById('reg-1').classList.add('hidden');
    loadProfile();
}

// РЕГИСТРАЦИЯ
function nextStep(n) {
    document.querySelectorAll('.overlay').forEach(o => o.classList.add('hidden'));
    document.getElementById('reg-'+n).classList.remove('hidden');
    if(n === 2) initDraw();
}

function initDraw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.onmousedown = () => drawing = true;
    canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
    canvas.onmousemove = (e) => {
        if(!drawing) return;
        ctx.lineWidth = 5; ctx.strokeStyle = color;
        ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke();
    };
}
function setCol(c) { color = c; }
function setClan(c) { clan = c; alert("Выбран: " + c); }

function finishReg() {
    user = {
        name: document.getElementById('nick').value,
        clan: clan,
        ava: document.getElementById('canvas').toDataURL()
    };
    localStorage.setItem('user', JSON.stringify(user));
    location.reload();
}

// ПОСТЫ И ГОЛОС
async function startVoice() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);
    chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg' });
        audioURL = URL.createObjectURL(blob);
        document.getElementById('mic').innerText = "✅ ЗАПИСАНО";
    };
    recorder.start();
    document.getElementById('mic').classList.add('mic-on');
    document.getElementById('mic').onclick = () => { recorder.stop(); document.getElementById('mic').classList.remove('mic-on'); };
}
document.getElementById('mic').onclick = startVoice;

function savePost() {
    const txt = document.getElementById('post-text').value;
    posts.unshift({ name: user.name, clan: user.clan, ava: user.ava, text: txt, audio: audioURL });
    localStorage.setItem('posts', JSON.stringify(posts));
    location.reload();
}

function renderFeed(data = posts) {
    const feed = document.getElementById('feed');
    feed.innerHTML = data.map(p => `
        <div class="post">
            <img src="${p.ava}" style="width:30px; border-radius:50%"> <b>${p.name}</b> ${p.clan}
            <p>${p.text}</p>
            ${p.audio ? `<audio src="${p.audio}" controls></audio>` : ''}
        </div>
    `).join('');
}

// НАВИГАЦИЯ
function showScreen(id) {
    document.querySelectorAll('.main-content').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'screen-main') renderFeed();
}

function loadProfile() {
    document.getElementById('my-nick').innerText = user.name;
    document.getElementById('my-clan').innerText = user.clan;
    document.getElementById('my-ava').src = user.ava;
    document.getElementById('user-tag').innerHTML = `<img src="${user.ava}" style="width:100%; border-radius:50%">`;
    showScreen('screen-main');
}

function toggleSearch() { document.getElementById('search-box').classList.toggle('hidden'); }
function doSearch() {
    const q = document.getElementById('search-in').value.toLowerCase();
    const filtered = posts.filter(p => p.text.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
    renderFeed(filtered);
}
function openModal() { document.getElementById('modal').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal').classList.add('hidden'); }
