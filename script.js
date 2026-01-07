let projects = [
    { id: 1, name: "PULSE_DEX", score: 2500, isWhale: true, desc: "A high-frequency trading engine built for the VIBE ecosystem.", git: "#", site: "#" },
    { id: 2, name: "NEON_VIBE", score: 1800, isWhale: true, desc: "Real-time analytics for top holders and whale movements.", git: "#", site: "#" },
    { id: 3, name: "GRID_CORE", score: 1200, isWhale: false, desc: "Decentralized data storage solution for developers.", git: "#", site: "#" },
    { id: 4, name: "RAW_TOOLS", score: 300, isWhale: false, desc: "CLI tools for fast wallet management and token deployment.", git: "#", site: "#" }
];

let userPower = 1.0;
let activeFeed = 'pulse';

// --- INITIAL SCAN (Unchanged) ---
document.getElementById('scanBtn').onclick = function() {
    const address = document.getElementById('walletInput').value;
    if (!address) return;
    this.querySelector('.btn-text').innerText = "SCANNING...";
    this.querySelector('.scan-bar').style.left = "0";
    document.getElementById('logTerminal').classList.remove('hidden');
    
    setTimeout(() => {
        userPower = address.startsWith('1') ? 10.0 : 1.0;
        document.getElementById('powerLevel').innerText = userPower.toFixed(2) + "x";
        document.getElementById('powerBarFill').style.width = (userPower > 1 ? "100%" : "20%");
        document.getElementById('gateScreen').classList.add('hidden');
        document.getElementById('homeScreen').classList.remove('hidden');
        loadArena();
    }, 2000);
};

// --- RENDER ARENA ---
function loadArena() {
    const feed = document.getElementById('projectFeed');
    const winners = [...projects].sort((a, b) => b.score - a.score).slice(0, 3).map(p => p.id);
    const filtered = projects.filter(p => activeFeed === 'pulse' ? p.isWhale : !p.isWhale);
    const glow = (userPower * 15) + "px";

    feed.innerHTML = filtered.map(p => `
        <div class="project-card ${p.isWhale ? 'obsidian' : ''}" id="card-${p.id}" onclick="openProjectModal(${p.id})">
            ${winners.includes(p.id) ? `<div class="winner-badge">FUNDING_ELIGIBLE</div>` : ''}
            <div class="card-content">
                <h2 style="font-size: 5rem; letter-spacing: -4px;">${p.name}</h2>
                <p style="opacity:0.4; margin-top:10px;">[ VIEW_DETAILS ]</p>
            </div>
            <div class="side-actions">
                <button class="action-btn up-btn" style="--glow-power: ${glow}" onclick="vote(${p.id}, 'up', this)">▲</button>
                <div class="score-tag" id="score-${p.id}">${p.score}</div>
                <button class="action-btn down-btn" onclick="vote(${p.id}, 'down', this)">▼</button>
            </div>
        </div>
    `).join('');
}

// --- MODAL CONTROLS ---
function openProjectModal(id) {
    const p = projects.find(x => x.id === id);
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalBody').innerText = p.desc;
    document.getElementById('modalGithub').href = p.git;
    document.getElementById('modalSite').href = p.site;
    document.getElementById('descModal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Global function for the Top 50 Whale button
document.getElementById('showFullLeaderboard').onclick = () => {
    const list = document.getElementById('fullLeaderboardList');
    list.innerHTML = Array.from({length: 50}).map((_, i) => `<div>#${i+1} ANON_WHALE_${Math.floor(Math.random()*999)}</div>`).join('');
    document.getElementById('leaderboardModal').classList.remove('hidden');
};

// --- VOTING & FEED TOGGLES (Simplified) ---
function vote(id, type, el) {
    event.stopPropagation();
    const p = projects.find(x => x.id === id);
    const impact = Math.round(10 * userPower);
    const card = document.getElementById(`card-${id}`);

    if (type === 'up') {
        p.score += impact;
        card.classList.add('shake-impact');
    } else {
        p.score -= Math.floor(impact / 2);
        card.classList.add('glitch-impact');
    }

    document.getElementById(`score-${id}`).innerText = p.score;
    setTimeout(() => { card.classList.remove('shake-impact'); card.classList.remove('glitch-impact'); }, 300);
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
        if(btn.dataset.tab === 'arenaTab') loadArena();
    };
});

document.getElementById('pulseBtn').onclick = () => { activeFeed = 'pulse'; updateFeedButtons('pulseBtn'); };
document.getElementById('rawBtn').onclick = () => { activeFeed = 'raw'; updateFeedButtons('rawBtn'); };

function updateFeedButtons(id) {
    document.querySelectorAll('.feed-toggle').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    loadArena();
}
