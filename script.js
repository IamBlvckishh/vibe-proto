let projects = [
    { id: 1, name: "LIQUID_VIBE", category: "DEFI", score: 45000, desc: "Automated liquidity provision for cultural assets." },
    { id: 2, name: "ORACLE_X", category: "TOOLS", score: 12000, desc: "Real-time sentiment data for launchpad graduation." },
    { id: 3, name: "NEON_SQUAD", category: "DAO", score: 5000, desc: "Governing the aesthetic layer of the blockchain." }
];

let userPower = 1.0;
const GOAL = 50000;

function initializeScan() {
    const addr = document.getElementById('walletInput').value;
    const toast = document.getElementById('assetToast');
    userPower = addr.length > 20 ? 10.0 : 1.0; // Simple whale detection logic
    toast.innerText = `POWER_LOCKED: ${userPower}x`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
    loadArena();
}

function launchConfetti() {
    const emojis = ['🔥', '✨', '💰', '🚀', '🟢'];
    for (let i = 0; i < 40; i++) {
        const c = document.createElement('div');
        c.className = 'snowflake';
        c.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        c.style.left = Math.random() * 100 + 'vw';
        c.style.fontSize = Math.random() * 20 + 10 + 'px';
        c.style.animationDuration = (Math.random() * 2 + 1) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 2000);
    }
}

function loadArena() {
    const feed = document.getElementById('projectFeed');
    feed.innerHTML = projects.map(p => {
        const progress = Math.min((p.score / GOAL) * 100, 100);
        const isGraduated = progress >= 100;
        
        return `
            <section class="art-card ${isGraduated ? 'graduated' : ''}">
                <div class="launch-header">
                    <span class="status-pill ${isGraduated ? 'gold' : 'pulse'}">
                        ${isGraduated ? 'GRADUATED' : 'LIVE_FUNDING'}
                    </span>
                    <span class="timer">SYNCING...</span>
                </div>

                <div class="terminal-view">
                    <h2 class="project-title">${p.name}</h2>
                    <div class="progress-container">
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                        </div>
                        <div class="progress-stats">
                            <span>${progress.toFixed(1)}% TO_TARGET</span>
                            <span>${GOAL.toLocaleString()} VIBES</span>
                        </div>
                    </div>
                    <p class="mission-text">${p.desc}</p>
                </div>

                <div class="launch-actions">
                    <div class="stat-box">
                        <small>VIBE_STRENGTH</small>
                        <strong>${p.score.toLocaleString()}</strong>
                    </div>
                    <button class="launch-btn" onclick="vote(${p.id}, event)">BOOST_VIBE</button>
                    <button class="mint-btn" onclick="openModal(${p.id})">TERMINAL_INFO</button>
                </div>

                <div class="ticker-wrap">
                    <div class="ticker">
                        NEW_BOOST_DETECTION (+${Math.round(10 * userPower)}) • NODE_SYNC_COMPLETE • ARENA_ID: ${p.id}99X
                    </div>
                </div>
            </section>
        `;
    }).join('');
}

function vote(id, e) {
    e.stopPropagation();
    const p = projects.find(x => x.id === id);
    const oldScore = p.score;
    p.score += Math.round(10 * userPower);
    
    if (oldScore < GOAL && p.score >= GOAL) {
        launchConfetti();
    }
    
    const toast = document.getElementById('assetToast');
    toast.innerText = `+${Math.round(10 * userPower)} IMPACT`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1000);
    loadArena();
}

function openModal(id) {
    const p = projects.find(x => x.id === id);
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalBody').innerText = p.desc;
    document.getElementById('projectModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('projectModal').classList.add('hidden');
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}

// Global Timer
setInterval(() => {
    document.querySelectorAll('.timer').forEach(t => {
        t.innerText = `T-MINUS: ${new Date().toLocaleTimeString()}`;
    });
}, 1000);

loadArena();
