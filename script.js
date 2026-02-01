let postsCount = 12;
let usersCount = 8;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function finishReg() {
    const nick = document.getElementById('reg-nick').value;
    if(nick) {
        document.getElementById('screen-reg').classList.add('hidden');
        // Создаем первый пост
        addPostToFeed(nick, "Я теперь в ИБО!", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500");
    }
}

function openPostModal() {
    const text = prompt("О чем думаешь?");
    if(text) {
        addPostToFeed("Вы", text);
        postsCount++;
        document.getElementById('stat-posts').innerText = postsCount;
    }
}

function addPostToFeed(name, text, imgUrl = null) {
    const feed = document.getElementById('feed');
    const post = document.createElement('div');
    post.className = 'post-card';
    
    let imgHtml = imgUrl ? `<img src="${imgUrl}">` : "";
    
    post.innerHTML = `
        <div class="post-user-info">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${name}">
            <div>
                <strong>${name}</strong><br>
                <small style="color:gray">1 минуту назад</small>
            </div>
        </div>
        <div class="post-content">
            ${text}
            ${imgHtml}
        </div>
    `;
    feed.prepend(post);
}
