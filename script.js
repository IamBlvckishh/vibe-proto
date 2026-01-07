let projects = [
    { id: 1, name: "PULSE_DEX", category: "DEFI", score: 2500, isWhale: true, desc: "Liquid vibe exchange.", git: "#", site: "#" },
    { id: 2, name: "NEON_VIBE", category: "TOOLS", score: 1800, isWhale: true, desc: "On-chain visualizer.", git: "#", site: "#" },
    { id: 3, name: "GRID_CORE", category: "INFRA", score: 1200, isWhale: false, desc: "Decentralized infra.", git: "#", site: "#" }
];

let fundedProjects = [
    { id: 100, name: "VIBE_LENS", category: "TOOLS", amount: "50,000 $SOL", date: "2025-12-28" }
];

let userPower = 1.0;
let activeFeed = 'pulse';
let activeCategory = 'ALL';

// --- GATE SYSTEM ---
document.getElementById('scanBtn').onclick = function() {
    const address = document.getElementById('walletInput').value;
    if (!address) return;
    this.querySelector('.btn-text').innerText = "SCANNING...";
    this.querySelector('.scan-bar').style.left = "0";
    setTimeout(() => {
        userPower = address.startsWith('1') ? 10.0 : 1.0;
        document.getElementById('powerLevel').innerText = userPower.toFixed(2) + "x";
        document.getElementById('powerBarFill').style.width = (userPower > 1 ? "100%" : "20%");
        document.getElementById('gateScreen').classList.add('hidden');
        document.getElementById('homeScreen').classList.remove('hidden');
        loadArena();
    }, 2000);
};

// --- ARENA LOGIC ---
function loadArena() {
    const feed = document.getElementById('projectFeed');
    const winners = [...projects].sort((a, b) => b.score - a.score).slice(0, 3).map(p => p.id);
    let filtered = projects.filter(p => activeFeed === 'pulse' ? p.isWhale : !p.isWhale);
    if (activeCategory !== 'ALL') filtered = filtered.filter(p => p.category === activeCategory);

    if (!filtered.length) { feed.innerHTML = `<div class="project-card"><h2>NO_DATA</h2></div>`; return; }

    feed.innerHTML = filtered.map(p => `
        <div class="project-card ${p.isWhale ? 'obsidian' : ''}" id="card-${p.id}" onclick="openProjectModal(${p.id})">
            <div class="card-category">${p.category}</div>
            ${winners.includes(p.id) ? `<div class="winner-badge">FUNDING_ELIGIBLE</div>` : ''}
            <div class="card-content">
                <h2 style="font-size: 5rem; letter-spacing: -4px;">${p.name}</h2>
                <p style="opacity:0.4; margin-top:10px;">[ VIEW_DETAILS ]</p>
            </div>
            <div class="side-actions">
                <button class="action-btn up-btn" onclick="vote(${p.id}, 'up', this)">▲</button>
                <div class="score-tag" id="score-${p.id}">${p.score}</div>
                <button class="action-btn down-btn" onclick="vote(${p.id}, 'down', this)">▼</button>
            </div>
        </div>
    `).join('');
}

function vote(id, type, el) {
    event.stopPropagation();
    const p = projects.find(x => x.id === id);
    const impact = Math.round(10 * userPower);
    if (type === 'up') { p.score += impact; document.getElementById(`card-${id}`).classList.add('shake-impact'); }
    else { p.score -= Math.floor(impact/2); document.getElementById(`card-${id}`).classList.add('glitch-impact'); }
    document.getElementById(`score-${id}`).innerText = p.score;
    setTimeout(() => { document.getElementById(`card-${id}`).classList.remove('shake-impact', 'glitch-impact'); }, 300);
    if (p.score >= 5000) graduate(id);
}

function graduate(id) {
    const idx = projects.findIndex(x => x.id === id);
    const p = projects[idx];
    fundedProjects.unshift({ id: p.id, name: p.name, category: p.category, amount: "5,000 $SOL", date: new Date().toISOString().split('T')[0] });
    projects.splice(idx, 1);
    alert(`${p.name} HAS SECURED FUNDING!`);
    loadArena();
}

// --- TAB SYSTEM ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(target).classList.remove('hidden');
        
        if(target === 'arenaTab') loadArena();
        if(target === 'fundedTab') loadFunded();
        if(target === 'submitTab') updateCategoryStats();
    };
});

function loadFunded() {
    document.getElementById('fundedGrid').innerHTML = fundedProjects.map(p => `
        <div class="funded-card">
            <div class="minted-stamp">MINTED</div>
            <div class="category-badge lime-bg">${p.category}</div>
            <h3 style="font-size: 1.8rem; margin: 15px 0;">${p.name}</h3>
            <div class="black-bg white-text" style="padding: 5px 10px; font-size: 0.8rem;">FUNDED: ${p.amount}</div>
        </div>
    `).join('');
}

function updateCategoryStats() {
    const cats = ["DEFI", "TOOLS", "NFT/ART", "INFRA", "MEME"];
    const totals = cats.map(c => ({ name: c, total: projects.filter(p => p.category === c).reduce((a, b) => a + b.score, 0) }));
    const max = Math.max(...totals.map(t => t.total));
    document.getElementById('categoryStats').innerHTML = totals.map(t => `
        <div class="stat-item ${t.total === max && t.total > 0 ? 'hot' : ''}">
            <span style="font-size:0.6rem; opacity:0.6;">${t.name}</span>
            <span class="cat-value">${t.total}</span>
        </div>`).join('');
}

function submitProject() {
    const name = document.getElementById('projName').value;
    if(!name) return;
    projects.push({
        id: Date.now(), name: name.toUpperCase(), category: document.getElementById('projCategory').value,
        score: 0, isWhale: (userPower >= 5.0), desc: document.getElementById('projDesc').value,
        git: document.getElementById('projGithub').value || "#", site: document.getElementById('projSite').value || "#"
    });
    document.querySelector('[data-tab="arenaTab"]').click();
}

// --- MODAL UTILS ---
function openProjectModal(id) {
    const p = projects.find(x => x.id === id);
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalBody').innerText = p.desc;
    document.getElementById('descModal').classList.remove('hidden');
}
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function setCategory(cat) { activeCategory = cat; document.querySelectorAll('.filter-tag').forEach(t => t.classList.toggle('active', t.innerText === cat)); loadArena(); }
