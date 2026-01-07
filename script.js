let projects = [
    { id: 1, name: "PULSE_DEX", score: 2500, isWhale: true },
    { id: 2, name: "NEON_VIBE", score: 1800, isWhale: true },
    { id: 3, name: "GRID_CORE", score: 1200, isWhale: false },
    { id: 4, name: "RAW_TOOLS", score: 300, isWhale: false }
];

let userBalance = 0;
let userPower = 1.0;
let activeFeed = 'pulse';

// --- INITIAL SCAN ---
document.getElementById('scanBtn').onclick = function() {
    const address = document.getElementById('walletInput').value;
    if (!address) return;
    this.querySelector('.btn-text').innerText = "SCANNING...";
    this.querySelector('.scan-bar').style.left = "0";
    document.getElementById('logTerminal').classList.remove('hidden');
    
    setTimeout(() => {
        userBalance = address.startsWith('1') ? 100000 : 5000;
        userPower = Math.max(1, userBalance / 10000);
        document.getElementById('powerLevel').innerText = userPower.toFixed(2) + "x";
        document.getElementById('powerBarFill').style.width = Math.min(100, (userBalance/50000)*100) + "%";
        
        document.getElementById('gateScreen').classList.add('hidden');
        document.getElementById('homeScreen').classList.remove('hidden');
        loadArena();
    }, 3000);
};

// --- RENDER ARENA ---
function loadArena() {
    const feed = document.getElementById('projectFeed');
    const winners = [...projects].sort((a, b) => b.score - a.score).slice(0, 3).map(p => p.id);
    const filtered = projects.filter(p => activeFeed === 'pulse' ? p.isWhale : !p.isWhale);
    const glow = (userPower * 20) + "px";

    feed.innerHTML = filtered.map(p => `
        <div class="project-card ${p.isWhale ? 'obsidian' : ''}" id="card-${p.id}">
            ${winners.includes(p.id) ? `<div class="winner-badge">FUNDING_ELIGIBLE</div>` : ''}
            <div class="card-content">
                <h2 style="font-size: 5rem; letter-spacing: -4px;">${p.name}</h2>
            </div>
            <div class="side-actions">
                <button class="action-btn up-btn" style="--glow-power: ${glow}" onclick="vote(${p.id}, 'up', this)">▲</button>
                <div class="score-tag" id="score-${p.id}">${p.score}</div>
                <button class="action-btn down-btn" onclick="vote(${p.id}, 'down', this)">▼</button>
            </div>
        </div>
    `).join('');

    // Occasional Upsell
    if(activeFeed === 'raw' && Math.random() > 0.7) {
        document.getElementById('vibeCheckBar').classList.remove('hidden');
        setTimeout(() => document.getElementById('vibeCheckBar').classList.add('hidden'), 4000);
    }
}

function vote(id, type, el) {
    event.stopPropagation();
    const p = projects.find(x => x.id === id);
    const impact = Math.round(10 * userPower);
    const card = document.getElementById(`card-${id}`);

    if (type === 'up') {
        p.score += impact;
        card.classList.add('shake-impact');
        showHit(el, `+${impact}`);
    } else {
        p.score -= Math.floor(impact / 2);
        card.classList.add('glitch-impact');
    }

    document.getElementById(`score-${id}`).innerText = p.score;
    setTimeout(() => {
        card.classList.remove('shake-impact');
        card.classList.remove('glitch-impact');
    }, 300);
}

function showHit(el, text) {
    const hit = document.createElement('div');
    hit.className = 'vibe-meter-hit';
    hit.innerText = text;
    hit.style.left = el.getBoundingClientRect().left + "px";
    hit.style.top = el.getBoundingClientRect().top + "px";
    document.body.appendChild(hit);
    setTimeout(() => hit.remove(), 800);
}

// --- TABS & MODALS ---
document.getElementById('pulseBtn').onclick = () => { activeFeed = 'pulse'; toggleFeed('pulseBtn'); };
document.getElementById('rawBtn').onclick = () => { activeFeed = 'raw'; toggleFeed('rawBtn'); };

function toggleFeed(id) {
    document.querySelectorAll('.feed-toggle').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    loadArena();
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
    };
});

document.getElementById('showFullLeaderboard').onclick = () => {
    const list = document.getElementById('fullLeaderboardList');
    list.innerHTML = Array.from({length: 50}).map((_, i) => `<div>#${i+1} ANON_WHALE_${Math.floor(Math.random()*999)}</div>`).join('');
    document.getElementById('leaderboardModal').classList.remove('hidden');
};

function closeModal() { document.getElementById('leaderboardModal').classList.add('hidden'); }
