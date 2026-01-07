const projects = [
    { id: 1, name: "PULSE_DEX", score: 1450, github: "github.com/vibe/pulse", desc: "Hyper-speed exchange for the 1B Vibe supply." },
    { id: 2, name: "VIBE_TERMINAL", score: 920, github: "github.com/vibe/term", desc: "Low-latency dashboard for Arena metrics." },
    { id: 3, name: "SHARD_LOGIC", score: 2300, github: "github.com/vibe/shard", desc: "L2 scaling solution using raw Rust logic." },
    { id: 4, name: "NEON_GRAPH", score: 400, github: "github.com/vibe/neon", desc: "Visualizing the social graph of all 1B Vibe holders." }
];

const scanLogs = [
    "> CONNECTING_TO_SOLANA_RPC...",
    "> SCANNING_WALLET_METADATA...",
    "> VERIFYING_1B_VIBE_SUPPLY...",
    "> DECRYPTING_ARENA_REPUTATION...",
    "> ACCESS_GRANTED_USER_001."
];

// LOGIN SCAN LOGIC
document.getElementById('scanBtn').onclick = function() {
    const address = document.getElementById('walletInput').value;
    const btn = this;
    if (!address) return;

    btn.querySelector('.btn-text').innerText = "SCANNING...";
    btn.querySelector('.scan-bar').style.left = "0";
    const terminal = document.getElementById('logTerminal');
    terminal.classList.remove('hidden');

    scanLogs.forEach((line, i) => {
        setTimeout(() => {
            const l = document.createElement('div');
            l.innerText = line;
            l.style.marginBottom = "5px";
            terminal.appendChild(l);
        }, i * 500);
    });

    setTimeout(() => {
        document.getElementById('gateScreen').classList.add('hidden');
        document.getElementById('homeScreen').classList.remove('hidden');
        loadArena();
    }, 3500);
};

// ARENA RENDER
function loadArena() {
    const feed = document.getElementById('projectFeed');
    feed.innerHTML = projects.map(p => {
        const trending = p.score > 1000 ? `<div class="trending-badge">HOT_VIBE</div>` : '';
        return `
            <div class="project-card" onclick="openProject(${p.id})">
                ${trending}
                <h2 style="font-size:2.5rem; border-bottom:4px solid black; margin-bottom:15px;">${p.name}</h2>
                <p>VIBE_SCORE: <span class="lime-bg">${p.score}</span></p>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button class="tab-btn" style="flex:1" onclick="event.stopPropagation(); vote(${p.id}, 10)">UP</button>
                    <button class="tab-btn" style="flex:1" onclick="event.stopPropagation(); vote(${p.id}, -10)">DOWN</button>
                </div>
            </div>
        `;
    }).join('');
}

// MODAL LOGIC
function openProject(id) {
    const p = projects.find(item => item.id === id);
    const content = document.getElementById('modalContent');
    content.innerHTML = `
        <h1 style="font-size:3.5rem;">${p.name}</h1>
        <p style="margin:20px 0; font-size:1.2rem; line-height:1.4;">${p.desc}</p>
        <a href="https://${p.github}" target="_blank" class="big-brutal-btn" style="display:block; text-align:center; text-decoration:none;">VIEW_GITHUB_SOURCE</a>
    `;
    document.getElementById('projectModal').classList.remove('hidden');
}

document.getElementById('closeModal').onclick = () => document.getElementById('projectModal').classList.add('hidden');

function vote(id, val) {
    const p = projects.find(item => item.id === id);
    p.score += val;
    loadArena();
}

// TAB NAVIGATION
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        if (!btn.dataset.tab) return;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    };
});
