let currentTheme = 'dark';
let userClan = '';
let userAvatar = '';
let posts = [];

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'screen-draw') initCanvas();
}

function setTheme(theme) {
    currentTheme = theme;
    if(theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    showScreen('screen-reg');
}

// ЛОГИКА РИСОВАНИЯ
let canvas, ctx, painting = false, color = '#000';

function initCanvas() {
    canvas = document.getElementById('paintCanvas');
    ctx = canvas.getContext('2d');
    
    canvas.onmousedown = (e) => { painting = true; draw(e); };
    canvas.onmouseup = () => { painting = false; ctx.beginPath(); };
    canvas.onmousemove = draw;

    function draw(e) {
        if(!painting) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = document.getElementById('brushSize').value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }
}

function setColor(c) { color = c; }

function selectClan(emoji) {
    userClan = emoji;
    userAvatar = canvas.toDataURL();
    const nick = document.getElementById('reg-nick').value;
    document.getElementById('user-name') ? document.getElementById('user-name').innerText = nick : null;
    showScreen('screen-main');
    // Добавим приветственный пост
    posts.push({author: 'Система', text: `Добро пожаловать в ИБО, ${nick}!`, clan: '🤖', avatar: userAvatar});
    renderFeed(posts);
}

// ПОСТЫ И ПОИСК
function openPostModal() {
    const msg = prompt("О чем ты думаешь? (ИБО)");
    if(msg) {
        const newPost = {
            author: document.getElementById('reg-nick').value,
            text: msg,
            clan: userClan,
            avatar: userAvatar
        };
        posts.unshift(newPost);
        renderFeed(posts);
    }
}

function renderFeed(items) {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    items.forEach(post => {
        feed.innerHTML += `
            <div class="post">
                <div style="padding: 12px; display: flex; align-items: center; gap: 10px;">
                    <img src="${post.avatar}" style="width:32px; height:32px; border-radius:50%; background:#eee;">
                    <span style="font-weight:700;">${post.author} ${post.clan}</span>
                </div>
                <div style="padding: 0 15px 15px 15px; line-height: 1.4;">${post.text}</div>
            </div>
        `;
    });
}

function toggleSearch() {
    const bar = document.getElementById('search-bar');
    bar.classList.toggle('hidden');
}

function search() {
    const q = document.getElementById('search-input').value.toLowerCase();
    const filtered = posts.filter(p => p.text.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
    renderFeed(filtered);
}
