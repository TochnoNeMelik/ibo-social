let state = {
    user: JSON.parse(localStorage.getItem('ibo_u')) || null,
    posts: JSON.parse(localStorage.getItem('ibo_p')) || [],
    audio: null,
    recorder: null
};

// ИНИЦИАЛИЗАЦИЯ
window.onload = () => {
    if(!state.user) {
        showScreen('screen-theme');
    } else {
        updateProfileUI();
        renderFeed();
    }
};

function toggleSearch() {
    document.getElementById('top-search').classList.toggle('hidden');
}

// ЗАПИСЬ ГОЛОСА С АНИМАЦИЕЙ
async function startVoice() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.recorder = new MediaRecorder(stream);
    let chunks = [];
    state.recorder.ondataavailable = e => chunks.push(e.data);
    state.recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => { state.audio = reader.result; };
        document.getElementById('wave').classList.remove('active');
    };
    state.recorder.start();
    document.getElementById('wave').classList.add('active');
    document.getElementById('mic-btn').onclick = stopVoice;
}

function stopVoice() {
    state.recorder.stop();
    document.getElementById('mic-btn').onclick = startVoice;
}
document.getElementById('mic-btn').onclick = startVoice;

// ПУБЛИКАЦИЯ
function publishPost() {
    const txt = document.getElementById('post-text').value;
    const post = {
        id: Date.now(),
        author: state.user.name,
        ava: state.user.ava,
        clan: state.user.clan,
        text: txt,
        audio: state.audio,
        likes: 0
    };
    state.posts.unshift(post);
    localStorage.setItem('ibo_p', JSON.stringify(state.posts));
    renderFeed();
    closePostModal();
    state.audio = null;
}

function renderFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = state.posts.map(p => `
        <div class="post-card">
            <div class="post-header">
                <img src="${p.ava}">
                <div>
                    <b>${p.author}</b> <small style="color:var(--accent)">${p.clan}</small>
                </div>
            </div>
            <div class="post-body">${p.text}</div>
            ${p.audio ? `<audio src="${p.audio}" controls style="margin-top:15px; width:100%; filter:invert(1)"></audio>` : ''}
            <div class="post-footer" style="margin-top:15px; opacity:0.6; display:flex; gap:20px;">
                <span onclick="alert('Лайк!')">🤍 ${p.likes}</span>
                <span onclick="alert('Комменты в разработке')">💬 0</span>
                <span onclick="alert('Репост')">🔁</span>
            </div>
        </div>
    `).join('');
}

function filterFeed() {
    const q = document.getElementById('global-search').value.toLowerCase();
    const filtered = state.posts.filter(p => p.text.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
    // Тут можно перерисовать только отфильтрованное
}

function updateProfileUI() {
    document.getElementById('nav-avatar').innerHTML = `<img src="${state.user.ava}" style="width:100%; height:100%; object-fit:cover;">`;
    document.getElementById('p-ava').src = state.user.ava;
    document.getElementById('p-name').innerText = state.user.name;
    document.getElementById('p-count').innerText = state.posts.length;
}

function showScreen(id) {
    document.querySelectorAll('.content, .overlay').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
