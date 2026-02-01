let currentUser = JSON.parse(localStorage.getItem('ibo_user')) || null;
let userPosts = JSON.parse(localStorage.getItem('ibo_posts')) || [];
let selectedClan = '';

// ПРОВЕРКА АККАУНТА ПРИ ЗАГРУЗКЕ
window.onload = () => {
    if (!currentUser) {
        document.getElementById('screen-reg').classList.remove('hidden');
    } else {
        loadProfile();
    }
};

function selectRegClan(emoji) {
    selectedClan = emoji;
    document.querySelectorAll('.clan-grid-reg span').forEach(s => s.classList.remove('selected-clan'));
    event.target.classList.add('selected-clan');
}

function finishReg() {
    const nick = document.getElementById('reg-nick').value;
    const user = document.getElementById('reg-user').value;
    
    if (nick && user && selectedClan) {
        currentUser = { name: nick, username: user, clan: selectedClan, friends: 0 };
        localStorage.setItem('ibo_user', JSON.stringify(currentUser));
        document.getElementById('screen-reg').classList.add('hidden');
        loadProfile();
    } else {
        alert("Выбери всё, включая клан!");
    }
}

function loadProfile() {
    document.getElementById('welcome-user').innerText = `Welcome back, ${currentUser.name}!`;
    document.getElementById('nav-avatar').innerText = currentUser.clan;
    document.getElementById('user-clan-tag').innerText = currentUser.clan;
    updateStats();
    renderFeed();
}

function updateStats() {
    document.getElementById('stat-posts').innerText = userPosts.length;
    document.getElementById('stat-users').innerText = currentUser.friends;
}

function openPostModal() {
    const text = prompt("Что на уме? (ИБО)");
    if (text) {
        const newPost = {
            id: Date.now(),
            author: currentUser.name,
            clan: currentUser.clan,
            content: text,
            time: "Только что"
        };
        userPosts.unshift(newPost);
        localStorage.setItem('ibo_posts', JSON.stringify(userPosts));
        updateStats();
        renderFeed();
    }
}

function renderFeed() {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    userPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = `post-card ${post.clan === '👑' ? 'clan-king' : ''}`;
        card.innerHTML = `
            <div class="post-user-info">
                <div class="avatar-box">${post.clan}</div>
                <div>
                    <strong>${post.author}</strong>
                    <small style="display:block; color:gray">${post.time}</small>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="voice-comment">
                <span>▶️</span> <div class="wave"></div> <span>0:05</span>
            </div>
        `;
        feed.appendChild(card);
    });
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
