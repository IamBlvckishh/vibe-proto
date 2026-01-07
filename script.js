let projects = [
    { id: 1, name: "ALPHA_LEAK", type: "DEFI", score: 42000, isPulse: true, desc: "Yield aggregator for vibe holders." },
    { id: 2, name: "PIXEL_MINT", type: "NFT", score: 12000, isPulse: false, desc: "Generative art engine." },
    { id: 3, name: "VIBE_CHECK", type: "TOOL", score: 8000, isPulse: true, desc: "Wallet sentiment analyzer." },
    { id: 4, name: "GHOST_CHAT", type: "TOOL", score: 3000, isPulse: false, desc: "Encrypted p2p messaging." }
];

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId + 'Tab').classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function renderAll() {
    const type = document.getElementById('typeFilter').value;
    const arena = document.getElementById('arenaTab');
    const pulse = document.getElementById('pulseGrid');
    const stream = document.getElementById('streamGrid');

    const filtered = type === 'ALL' ? projects : projects.filter(p => p.type === type);

    // Render Arena
    arena.innerHTML = filtered.map(p => `
        <section class="art-card">
            <div class="terminal">
                <small style="color:var(--lime)">${p.type}</small>
                <h2 style="font-size: 32px; margin: 10px 0;">${p.name}</h2>
                <div class="progress-bar" style="width: ${(p.score/50000)*100}%"></div>
                <p style="font-size: 12px; opacity: 0.7;">${p.desc}</p>
                <div style="margin-top: 20px; font-weight: 900; font-size: 10px;">STRENGTH: ${p.score}</div>
            </div>
            <div class="vote-stack">
                <button class="v-btn up" onclick="vote(${p.id}, 100)">↑</button>
                <button class="v-btn down" onclick="vote(${p.id}, -50)">↓</button>
            </div>
        </section>
    `).join('');

    // Render Hall Pulse
    pulse.innerHTML = filtered.filter(p => p.isPulse).map(p => `
        <div class="tile">
            <h4>${p.name}</h4>
            <div style="opacity:0.5">${p.type}</div>
            <div style="margin-top:10px">${p.score}</div>
        </div>
    `).join('');

    // Render Hall Stream
    stream.innerHTML = filtered.filter(p => !p.isPulse).map(p => `
        <div class="tile">
            <h4>${p.name}</h4>
            <div style="opacity:0.5">${p.type}</div>
            <div style="margin-top:10px">${p.score}</div>
        </div>
    `).join('');
}

function vote(id, amt) {
    const p = projects.find(x => x.id === id);
    p.score += amt;
    const toast = document.getElementById('assetToast');
    toast.innerText = amt > 0 ? "VIBE_BOOSTED" : "VIBE_REDUCED";
    toast.style.opacity = 1;
    setTimeout(() => toast.style.opacity = 0, 1000);
    renderAll();
}

function submitProject() {
    const newProj = {
        id: Date.now(),
        name: document.getElementById('pTitle').value,
        type: "NEW",
        score: 0,
        isPulse: false,
        desc: document.getElementById('pDesc').value
    };
    projects.push(newProj);
    alert("LAUNCH_INITIALIZED");
    switchTab('arena');
    renderAll();
}

function toggleTheme() {
    const h = document.documentElement;
    h.setAttribute('data-theme', h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

// Init
renderAll();
