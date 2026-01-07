// --- DATA ---
let projects = [
    { id: 1, name: "PULSE_DEX", category: "DEFI", score: 2500, isWhale: true, desc: "A high-frequency trading engine optimized for the VIBE ecosystem.", git: "#", site: "#" },
    { id: 2, name: "NEON_VIBE", category: "TOOLS", score: 1800, isWhale: true, desc: "Visual analytics for on-chain whale movements and holder clusters.", git: "#", site: "#" },
    { id: 3, name: "GRID_CORE", category: "INFRA", score: 1200, isWhale: false, desc: "Decentralized RPC layer with incentivized nodes.", git: "#", site: "#" }
];
let fundedProjects = [
    { id: 100, name: "VIBE_LENS", category: "TOOLS", amount: "5,000 $SOL", date: "2026-01-05" }
];

let userPower = 1.0;
let activeFeed = 'pulse';
let activeCategory = 'ALL';

// --- GATE LOGIC ---
document.getElementById('scanBtn').onclick = function() {
    const address = document.getElementById('walletInput').value;
    if (!address) return;
    this.disabled = true;
    this.querySelector('.btn-text').innerText = "SCANNING_WALLET...";
    this.querySelector('.scan-bar').style.left = "0";
    
    setTimeout(() => {
        userPower = address.startsWith('1') ? 10.0 : 1.5;
        document.getElementById('powerLevel').innerText = userPower.toFixed(2) + "x";
        document.getElementById('powerBarFill').style.width = (userPower > 2 ? "100%" : "30%");
        document.getElementById('gateScreen').classList.add('hidden');
        document.getElementById('homeScreen').classList.remove('hidden');
        loadArena();
    }, 2500);
};

// --- RENDER ARENA ---
function loadArena() {
    const feed = document.getElementById('projectFeed');
    const winners = [...projects].sort((a, b) => b.score - a.score).slice(0, 3).map(p => p.id);
    
    let filtered = projects.filter(p => activeFeed === 'pulse' ? p.isWhale : !p.isWhale);
    if (activeCategory !== 'ALL') filtered = filtered.filter(p => p.category === activeCategory);

    if (!filtered.length) {
        feed.innerHTML = `<div class="project-card"><h2>EMPTY_FEED</h2></div>`;
        return;
    }

    feed.innerHTML = filtered.map(p => `
        <div class="project-card ${p.isWhale ? 'obsidian' : ''}" id="card-${p.id}" onclick="openProjectModal(${p.id})">
            <div class="card-category">${p.category}</div>
            ${winners.includes(p.id) ? `<div class="winner-badge">FUNDING_ELIGIBLE</div>` : ''}
            <div class="card-content">
                <h2 style="font-size: 4.5rem; letter-spacing: -4px; line-height: 0.9;">${p.name}</h2>
                <p style="opacity:0.4; margin-top:15px; font-weight:900;">[ TAP_FOR_DETAILS ]</p>
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
    if (p.score >= 5000) {
        const idx = projects.findIndex(x => x.id === id);
        fundedProjects.unshift({...p, amount: "10,000 $SOL", date: "JUST_NOW"});
        projects.splice(idx, 1);
        alert("GOAL REACHED! PROJECT GRADUATED.");
        loadArena();
    }
}

// --- MODAL SYSTEM ---
function openProjectModal(id) {
    const p = projects.find(x => x.id === id);
    if(!p) return;
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalCategory').innerText = p.category;
    document.getElementById('modalBody').innerText = p.desc;
    const modal = document.getElementById('descModal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

document.getElementById('closeDescBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal('descModal');
});

document.querySelectorAll('.modal-overlay').forEach(m => {
    m.onclick = (e) => { if(e.target === m) closeModal(m.id); };
});

// --- TAB NAVIGATION ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(target).classList.remove('hidden');
        if(target === 'arenaTab') { loadArena(); window.scrollTo(0, 0); }
        if(target === 'fundedTab') loadFunded();
        if(target === 'submitTab') updateStats();
    };
});

function loadFunded() {
    document.getElementById('fundedGrid').innerHTML = fundedProjects.map(p => `
        <div class="funded-card">
            <div class="card-category lime-bg" style="top:10px; right:10px;">${p.category}</div>
            <h3>${p.name}</h3>
            <div class="black-bg white-text" style="padding:5px; margin-top:10px; font-size:0.8rem;">FUNDED: ${p.amount}</div>
        </div>
    `).join('');
}

function updateStats() {
    const cats = ["DEFI", "TOOLS", "NFT/ART", "INFRA", "MEME"];
    document.getElementById('categoryStats').innerHTML = cats.map(c => {
        const total = projects.filter(p => p.category === c).reduce((a, b) => a + b.score, 0);
        return `<div class="stat-item"><span>${c}</span><br><strong>${total}</strong></div>`;
    }).join('');
}

document.getElementById('pulseBtn').onclick = () => { activeFeed = 'pulse'; updateFeedUI('pulseBtn'); };
document.getElementById('rawBtn').onclick = () => { activeFeed = 'raw'; updateFeedUI('rawBtn'); };
function updateFeedUI(btnId) {
    document.querySelectorAll('.feed-toggle').forEach(b => b.classList.remove('active'));
    document.getElementById(btnId).classList.add('active');
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
        score: 0, isWhale: (userPower > 5), desc: document.getElementById('projDesc').value, git: "#", site: "#"
    });
    document.querySelector('[data-tab="arenaTab"]').click();
}
