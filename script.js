let projects = [
    { id: 1, name: "PULSE_DEX", category: "DEFI", score: 2500, isWhale: true, desc: "Liquid vibe exchange engine." },
    { id: 2, name: "NEON_VIBE", category: "TOOLS", score: 1800, isWhale: true, desc: "On-chain visual analytics." },
    { id: 3, name: "GRID_CORE", category: "INFRA", score: 1200, isWhale: false, desc: "Decentralized node layer." }
];
let fundedProjects = [];
let userPower = 1.0;
let activeFeed = 'pulse';
let activeCategory = 'ALL';

// --- INITIALIZE SCAN ---
document.getElementById('scanBtn').onclick = function() {
    this.disabled = true;
    this.querySelector('.btn-text').innerText = "SCANNING...";
    this.querySelector('.scan-bar').style.left = "0";
    setTimeout(() => {
        userPower = 2.5; 
        document.getElementById('powerLevel').innerText = userPower.toFixed(2) + "x";
        document.getElementById('powerBarFill').style.width = "40%";
        document.getElementById('gateScreen').classList.add('hidden');
        document.getElementById('homeScreen').classList.remove('hidden');
        loadArena();
    }, 2000);
};

// --- RENDER ARENA ---
function loadArena() {
    const feed = document.getElementById('projectFeed');
    let filtered = projects.filter(p => activeFeed === 'pulse' ? p.isWhale : !p.isWhale);
    if (activeCategory !== 'ALL') filtered = filtered.filter(p => p.category === activeCategory);

    feed.innerHTML = filtered.map(p => `
        <div class="project-card ${p.isWhale ? 'obsidian' : ''}" id="card-${p.id}">
            <div class="card-category">${p.category}</div>
            <div class="details-trigger" onclick="openProjectModal(${p.id})">
                <h2 style="font-size: 3.5rem; letter-spacing: -3px; line-height: 0.9;">${p.name}</h2>
                <p style="opacity:0.5; margin-top:15px; font-weight:900;">[ VIEW_DETAILS ]</p>
            </div>
            <div class="side-actions">
                <button class="action-btn up-btn" onclick="vote(${p.id}, 'up', event)">▲</button>
                <div class="score-tag" id="score-${p.id}">${p.score}</div>
                <button class="action-btn down-btn" onclick="vote(${p.id}, 'down', event)">▼</button>
            </div>
        </div>
    `).join('');
}

// --- VOTING & EFFECTS ---
function vote(id, type, e) {
    e.stopPropagation();
    const p = projects.find(x => x.id === id);
    const card = document.getElementById(`card-${id}`);
    const impact = Math.round(10 * userPower);

    if (type === 'up') {
        p.score += impact;
        card.classList.add('shake-impact');
        setTimeout(() => card.classList.remove('shake-impact'), 200);
    } else {
        p.score -= Math.floor(impact / 2);
        card.classList.add('glitch-impact');
        setTimeout(() => card.classList.remove('glitch-impact'), 200);
    }
    document.getElementById(`score-${id}`).innerText = p.score;
}

// --- MODAL CONTROLS ---
function openProjectModal(id) {
    const p = projects.find(x => x.id === id);
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalCategory').innerText = p.category;
    document.getElementById('modalBody').innerText = p.desc || "NO_DESC";
    const modal = document.getElementById('descModal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('hidden');
    modal.style.display = 'none';
}
document.getElementById('closeDescBtn').onclick = () => closeModal('descModal');

// --- TABS & FEED TOGGLE ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(target).classList.remove('hidden');
        if(target === 'arenaTab') loadArena();
    };
});

document.getElementById('pulseBtn').onclick = () => { activeFeed = 'pulse'; toggleFeedUI('pulseBtn'); };
document.getElementById('rawBtn').onclick = () => { activeFeed = 'raw'; toggleFeedUI('rawBtn'); };
function toggleFeedUI(id) {
    document.querySelectorAll('.feed-toggle').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    loadArena();
}

function setCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.toggle('active', t.innerText === cat));
    loadArena();
}

function submitProject() {
    const name = document.getElementById('projName').value;
    if(!name) return;
    projects.push({
        id: Date.now(), name: name.toUpperCase(), category: document.getElementById('projCategory').value,
        score: 0, isWhale: (userPower > 5), desc: document.getElementById('projDesc').value
    });
    document.querySelector('[data-tab="arenaTab"]').click();
}
