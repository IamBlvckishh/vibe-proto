const projects = [
    { id: 1, name: "PULSE_DEX", score: 1450, isWhale: true },
    { id: 2, name: "NEON_VIBE", score: 890, isWhale: true },
    { id: 3, name: "RAW_TOOLS", score: 42, isWhale: false },
    { id: 4, name: "GRID_LOGIC", score: 110, isWhale: false }
];

const whales = [
    { name: "V_KONG", power: "9.5x" },
    { name: "S_CHAD", power: "7.2x" },
    { name: "D_REPT", power: "5.0x" }
];

let userBalance = 0;
let userPower = 1.0;
let activeFeed = 'pulse';

// --- LOGIN FLOW ---
document.getElementById('scanBtn').onclick = function() {
    const address = document.getElementById('walletInput').value;
    if (!address) return;

    this.querySelector('.btn-text').innerText = "SCANNING...";
    this.querySelector('.scan-bar').style.left = "0";
    const terminal = document.getElementById('logTerminal');
    terminal.classList.remove('hidden');

    const logs = ["> CONN_SOL...", "> SCAN_VIBE...", "> BAL_CHECK...", "> ACCESS_GRANT"];
    logs.forEach((l, i) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.innerText = l;
            terminal.appendChild(div);
        }, i * 500);
    });

    setTimeout(() => {
        userBalance = address.startsWith('1') ? 100000 : 5000;
        userPower = Math.max(1, userBalance / 10000);
        document.getElementById('powerLevel').innerText = userPower.toFixed(2) + "x";
        document.getElementById('powerBarFill').style.width = Math.min(100, (userBalance/50000)*100) + "%";
        
        if(userBalance < 50000) document.getElementById('vibeCheckBar').classList.remove('hidden');
        
        document.getElementById('gateScreen').classList.add('hidden');
        document.getElementById('homeScreen').classList.remove('hidden');
        updateLeaderboard();
        loadArena();
    }, 3000);
};

// --- ARENA RENDER ---
function loadArena() {
    const feed = document.getElementById('projectFeed');
    const filtered = projects.filter(p => activeFeed === 'pulse' ? p.isWhale : !p.isWhale);
    const glow = (userPower * 20) + "px";

    feed.innerHTML = filtered.map(p => `
        <div class="project-card ${p.isWhale ? 'obsidian' : ''}" id="card-${p.id}">
            <div class="card-content">
                <h2 style="font-size: 5rem; letter-spacing: -5px;">${p.name}</h2>
                <p style="opacity:0.5">[ TAP_FOR_DETAILS ]</p>
            </div>
            <div class="side-actions">
                <button class="action-btn up-btn" style="--glow-power: ${glow}" onclick="event.stopPropagation(); triggerVibe(${p.id}, this)">▲</button>
                <div class="score-tag" id="score-${p.id}">${p.score}</div>
                <button class="action-btn down-btn" onclick="event.stopPropagation();">▼</button>
            </div>
        </div>
    `).join('');
}

function triggerVibe(id, el) {
    const impact = Math.round(10 * userPower);
    const p = projects.find(x => x.id === id);
    p.score += impact;
    document.getElementById(`score-${id}`).innerText = p.score;

    const card = document.getElementById(`card-${id}`);
    card.classList.add('shake-impact');
    setTimeout(() => card.classList.remove('shake-impact'), 200);

    const hit = document.createElement('div');
    hit.className = 'vibe-meter-hit';
    hit.innerText = `+${impact}_VIBE`;
    hit.style.left = el.getBoundingClientRect().left + "px";
    hit.style.top = el.getBoundingClientRect().top + "px";
    document.body.appendChild(hit);
    setTimeout(() => hit.remove(), 800);
}

// --- NAVIGATION & UI ---
document.getElementById('pulseBtn').onclick = () => { activeFeed = 'pulse'; switchFeed('pulseBtn'); };
document.getElementById('rawBtn').onclick = () => { activeFeed = 'raw'; switchFeed('rawBtn'); };

function switchFeed(btnId) {
    document.querySelectorAll('.feed-toggle').forEach(t => t.classList.remove('active'));
    document.getElementById(btnId).classList.add('active');
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

function updateLeaderboard() {
    const list = document.getElementById('whaleList');
    list.innerHTML = whales.map((w, i) => `
        <div class="whale-item">
            <span style="font-size:0.5rem">#${i+1}</span><br>
            <b>${w.name}</b><br>${w.power}
        </div>
    `).join('');
}

// GITHUB MODAL
document.querySelector('.github-btn').onclick = () => document.getElementById('githubModal').classList.remove('hidden');
document.getElementById('confirmGH').onclick = () => {
    document.querySelector('.github-btn').innerText = "CONNECTED: @DEV";
    document.querySelector('.github-btn').style.background = "var(--lime)";
    document.getElementById('githubModal').classList.add('hidden');
};
document.getElementById('cancelGH').onclick = () => document.getElementById('githubModal').classList.add('hidden');
