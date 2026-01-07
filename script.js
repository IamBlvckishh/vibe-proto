let projects = [
    { id: 1, name: "PULSE_DEX", category: "DEFI", score: 2500, isWhale: true, desc: "Liquid vibe exchange engine." },
    { id: 2, name: "NEON_VIBE", category: "TOOLS", score: 1800, isWhale: true, desc: "On-chain visualizer." },
    { id: 3, name: "GRID_CORE", category: "INFRA", score: 1200, isWhale: false, desc: "Decentralized node layer." }
];

let userPower = 1.0;
let currentView = 'snap';
let currentCategory = 'ALL';

function initializeScan() {
    const addr = document.getElementById('walletInput').value;
    const toast = document.getElementById('assetToast');
    
    // Simulate Scan
    document.getElementById('goBtn').innerText = "...";
    setTimeout(() => {
        userPower = addr.startsWith('1') ? 10.0 : 1.0;
        toast.innerText = `POWER_LOCKED: ${userPower}x`;
        toast.classList.add('show');
        document.getElementById('goBtn').innerText = "GO";
        setTimeout(() => toast.classList.remove('show'), 2000);
        loadArena();
    }, 1000);
}

function loadArena() {
    const feed = document.getElementById('projectFeed');
    let filtered = projects;
    if (currentCategory !== 'ALL') filtered = projects.filter(p => p.category === currentCategory);

    feed.innerHTML = filtered.map(p => `
        <section class="art-card" onclick="openModal(${p.id})">
            <div class="collection-slider">
                <div class="collection-slide" style="background: ${p.isWhale ? '#111' : '#000'}; border: 2px solid ${p.isWhale ? '#a3ff00' : '#222'}">
                    <div style="text-align: center;">
                        <h2 style="font-size: 40px; letter-spacing: -2px;">${p.name}</h2>
                        <p style="font-size: 10px; opacity: 0.5; margin-top: 10px;">TAP_FOR_DETAILS</p>
                    </div>
                </div>
            </div>
            <div class="collection-counter">${p.score} VIBES</div>
            <div style="position: absolute; bottom: 100px; right: 20px; display: flex; flex-direction: column; gap: 10px;">
                <button onclick="vote(${p.id}, event)" style="background: #a3ff00; border: none; width: 50px; height: 50px; border-radius: 50%; font-weight: 900;">↑</button>
            </div>
        </section>
    `).join('');
}

function vote(id, e) {
    e.stopPropagation();
    const p = projects.find(x => x.id === id);
    p.score += Math.round(10 * userPower);
    
    const toast = document.getElementById('assetToast');
    toast.innerText = `+${Math.round(10 * userPower)} VIBE_IMPACT`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1500);
    loadArena();
}

function switchTab(view) {
    currentView = view;
    document.getElementById('projectFeed').setAttribute('data-view', view);
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.currentTarget.classList.add('active');
    loadArena();
}

function openModal(id) {
    const p = projects.find(x => x.id === id);
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalBody').innerText = p.desc;
    document.getElementById('modalCategory').innerText = p.category;
    document.getElementById('projectModal').classList.remove('hidden');
    document.body.classList.add('show-details');
}

function closeModal() {
    document.getElementById('projectModal').classList.add('hidden');
    document.body.classList.remove('show-details');
}

function toggleTheme() {
    const html = document.documentElement;
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function setCategory(cat) {
    currentCategory = cat;
    loadArena();
}

// Initial Load
loadArena();
