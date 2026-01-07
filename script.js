// --- DATA STATE ---
let projects = [
    { id: 1, name: "PULSE_DEX", score: 2850, isWhale: true, desc: "High-speed swap for 1B supply." },
    { id: 2, name: "NEON_VIBE", score: 2100, isWhale: true, desc: "Visualizer for whale movements." },
    { id: 3, name: "GRID_CORE", score: 1400, isWhale: false, desc: "Decentralized storage layer." },
    { id: 4, name: "RAW_TOOLS", score: 450, isWhale: false, desc: "Collection of CLI utils." },
    { id: 5, name: "SHARD_X", score: 105, isWhale: false, desc: "Experimental sharding." }
];

const whales = ["VIBE_KONG (9.8x)", "SOL_CHAD (8.4x)", "DEGEN_REPT (6.2x)", "ANON_WHALE (5.5x)", "LIQUID_MOON (4.9x)"];

let userBalance = 0;
let userPower = 1.0;
let activeFeed = 'pulse';

// --- LOGIN & SCANNING ---
document.getElementById('scanBtn').onclick = function() {
    const address = document.getElementById('walletInput').value;
    if (!address) return;

    const btn = this;
    btn.querySelector('.btn-text').innerText = "SYSTEM_SCANNING...";
    btn.querySelector('.scan-bar').style.left = "0";
    const terminal = document.getElementById('logTerminal');
    terminal.classList.remove('hidden');

    const scanLogs = [
        "> CONNECTING_RPC...",
        "> READING_BALANCE...",
        "> CALCULATING_VIBE_POWER...",
        "> ACCESS_GRANTED"
    ];

    scanLogs.forEach((log, i) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.innerText = log;
            terminal.appendChild(line);
        }, i * 600);
    });

    setTimeout(() => {
        // Logic: if address starts with '1', user is a Whale
        userBalance = address.startsWith('1') ? 150000 : 5000;
        userPower = Math.max(1, userBalance / 10000);
        
        // Update UI Header
        document.getElementById('powerLevel').innerText = userPower.toFixed(2) + "x";
        document.getElementById('powerBarFill').style.width = Math.min(100, (userBalance/50000)*100) + "%";
        
        document.getElementById('gateScreen').classList.add('hidden');
        document.getElementById('homeScreen').classList.remove('hidden');
        loadArena();
    }, 3200);
};

// --- FUNDING LOGIC ---
function getTopWinners() {
    return [...projects].sort((a, b) => b.score - a.score).slice(0, 3).map(p => p.id);
}

// --- ARENA RENDERING ---
function loadArena() {
    const feed = document.getElementById('projectFeed');
    const winners = getTopWinners();
    const filtered = projects.filter(p => activeFeed === 'pulse' ? p.isWhale : !p.isWhale);
    const glowSize = (userPower * 25) + "px";

    feed.innerHTML = filtered.map(p => {
        const isWinner = winners.includes(p.id) ? `<div class="winner-badge">WEEKLY_WINNER: FUNDED</div>` : '';
        const cardType = p.isWhale ? 'obsidian' : '';
        
        return `
            <div class="project-card ${cardType}" id="card-${p.id}" onclick="openDetail(${p.id})">
                ${isWinner}
                <div class="card-content">
                    <h2 style="font-size: 5.5rem; letter-spacing: -6px; line-height: 0.8;">${p.name}</h2>
                    <p style="margin-top: 20px; opacity: 0.4;">[ CLICK_FOR_DETAILS ]</p>
                </div>
                <div class="side-actions">
                    <button class="action-btn up-btn" style="--glow-power: ${glowSize}" onclick="event.stopPropagation(); handleVote(${p.id}, 'up', this)">▲</button>
                    <div class="score-tag" id="score-${p.id}">${p.score}</div>
                    <button class="action-btn down-btn" onclick="event.stopPropagation(); handleVote(${p.id}, 'down', this)">▼</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Random Upsell Bar
    if(activeFeed === 'raw' && Math.random() > 0.6) {
        const bar = document.getElementById('vibeCheckBar');
        bar.classList.remove('hidden');
        setTimeout(() => bar.classList.add('hidden'), 4000);
    }
}

// --- VOTING SYSTEM ---
function handleVote(id, type, el) {
    const p = projects.find(x => x.id === id);
    const impact = Math.round(10 * userPower);
    const card = document.getElementById(`card-${id}`);

    if (type === 'up') {
        p.score += impact;
        card.classList.add('shake-impact');
        showVibeMeter(el, `+${impact}_POWER`);
    } else {
        p.score -= Math.floor(impact / 2);
        card.classList.add('glitch-impact');
    }

    document.getElementById(`score-${id}`).innerText = p.score;
    
    // Clean up animations
    setTimeout(() => {
        card.classList.remove('shake-impact');
        card.classList.remove('glitch-impact');
    }, 400);
}

function showVibeMeter(el, text) {
    const hit = document.createElement('div');
    hit.className = 'vibe-meter-hit';
    hit.innerText = text;
    hit.style.left = el.getBoundingClientRect().left + "px";
    hit.style.top = el.getBoundingClientRect().top + "px";
    document.body.appendChild(hit);
    setTimeout(() => hit.remove(), 800);
}

// --- NAVIGATION ---
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

// --- LEADERBOARD & GITHUB ---
document.getElementById('showFullLeaderboard').onclick = () => {
    const list = document.getElementById('fullLeaderboardList');
    list.innerHTML = Array.from({length: 50}).map((_, i) => `
        <div class="leaderboard-entry">#${i+1} ${Math.random().toString(36).substring(7).toUpperCase()}... [${Math.floor(Math.random()*200)}K $VIBE]</div>
    `).join('');
    document.getElementById('leaderboardModal').classList.remove('hidden');
};

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

document.querySelector('.github-btn').onclick = function() {
    this.innerText = "WAITING_AUTH...";
    setTimeout(() => {
        document.getElementById('githubModal').classList.remove('hidden');
    }, 500);
};

document.getElementById('confirmGH').onclick = () => {
    const btn = document.querySelector('.github-btn');
    btn.innerText = "CONNECTED: @DEV_WHALE";
    btn.classList.add('lime-bg');
    closeModal('githubModal');
};
