let projects = [
    { id: 1, name: "ALPHA_LEAK", type: "DEFI", up: 550, down: 10, isPulse: true, desc: "Yield aggregator for high-aura vibe holders.", img: "", dim: 0.7, history: [400, 420, 550] },
    { id: 2, name: "PIXEL_MINT", type: "NFT", up: 120, down: 45, isPulse: false, desc: "Generative art engine for recursive textures.", img: "", dim: 0.8, history: [150, 140, 120] },
    { id: 3, name: "VOID_RPC", type: "TOOL", up: 890, down: 5, isPulse: true, desc: "Ultra-private endpoints for stealth swaps.", img: "", dim: 0.6, history: [700, 890] },
    { id: 4, name: "NEON_DEX", type: "DEFI", up: 300, down: 80, isPulse: false, desc: "L2 native exchange with 0ms slippage.", img: "", dim: 0.7, history: [100, 300] },
    { id: 5, name: "AURA_SCORE", type: "TOOL", up: 45, down: 60, isPulse: false, desc: "Social reputation layer for wallets.", img: "", dim: 0.8, history: [80, 45] },
    { id: 6, name: "CYBER_DAO", type: "NFT", up: 950, down: 2, isPulse: true, desc: "Governance over virtual cyberpunk districts.", img: "", dim: 0.5, history: [500, 950] },
    { id: 7, name: "ROOT_DEBUG", type: "TOOL", up: 210, down: 190, isPulse: false, desc: "Universal smart contract debugger.", img: "", dim: 0.7, history: [250, 210] },
    { id: 8, name: "GHOST_LPT", type: "DEFI", up: 600, down: 20, isPulse: true, desc: "ZKP-based liquidity provision system.", img: "", dim: 0.7, history: [400, 600] },
    { id: 9, name: "SYNTH_NFT", type: "NFT", up: 80, down: 110, isPulse: false, desc: "Audio-visual generative collectibles.", img: "", dim: 0.8, history: [150, 80] },
    { id: 10, name: "ORBIT_X", type: "TOOL", up: 150, down: 10, isPulse: false, desc: "Real-time cross-chain bridge tracker.", img: "", dim: 0.7, history: [50, 150] },
    { id: 11, name: "VIBE_STAKE", type: "DEFI", up: 720, down: 15, isPulse: true, desc: "Staking portal for the Vibe ecosystem.", img: "", dim: 0.7, history: [500, 720] },
    { id: 12, name: "MINT_SNIPER", type: "TOOL", up: 410, down: 30, isPulse: false, desc: "High-priority contract interaction tool.", img: "", dim: 0.6, history: [200, 410] }
];

let lastUploadedImg = "";

function handleImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => lastUploadedImg = e.target.result;
        reader.readAsDataURL(input.files[0]);
    }
}

function updateDimLabel(val) { document.getElementById('dimVal').innerText = val; }

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId + 'Tab').classList.remove('hidden');
    event.currentTarget.classList.add('active');
    renderAll();
}

function getVibeStatus(up, down) {
    const ratio = up / ((up + down) || 1);
    if (up > 500 && ratio > 0.9) return { label: "ELITE_VIBE", class: "vibe-elite" };
    if (ratio > 0.7) return { label: "HIGH_VIBE", class: "vibe-high" };
    return ratio > 0.4 ? { label: "NEUTRAL", class: "" } : { label: "LOW_VIBE", class: "vibe-low" };
}

function generateSparkline(history, color) {
    const min = Math.min(...history), max = Math.max(...history), range = max - min || 1;
    const pts = history.map((v, i) => `${(i/(history.length-1))*100},${30-((v-min)/range)*30}`).join(' ');
    return `<svg width="100%" height="30" viewBox="0 0 100 30" preserveAspectRatio="none"><polyline fill="none" stroke="${color}" stroke-width="2" points="${pts}"/></svg>`;
}

function renderAll() {
    const type = document.getElementById('typeFilter').value;
    const filtered = type === 'ALL' ? projects : projects.filter(p => p.type === type);

    // Arena Rendering
    document.getElementById('arenaTab').innerHTML = filtered.map(p => {
        const vibe = getVibeStatus(p.up, p.down);
        const hasImg = p.img !== "";
        return `
            <section class="art-card ${!hasImg?'arena-placeholder':''}" onclick="openModal(${p.id})" style="background-image:url('${p.img}'); --card-dim:${p.dim}">
                ${!hasImg?`<div class="placeholder-icon">${p.name[0]}</div>`:''}
                <div class="vibe-status ${vibe.class}">${vibe.label}</div>
                <div class="terminal">
                    <small style="color:var(--lime)">${p.type}</small>
                    <h2 style="font-size:32px; margin:8px 0;">${p.name}</h2>
                    <p style="font-size:12px; opacity:0.9; font-weight:500;">${p.desc}</p>
                </div>
                <div class="vote-stack" onclick="event.stopPropagation()">
                    <div class="vote-group"><button class="v-btn up" onclick="vote(${p.id},'up')">↑</button><div class="vote-count" style="color:var(--lime)">${p.up}</div></div>
                    <div class="vote-group"><button class="v-btn down" onclick="vote(${p.id},'down')">↓</button><div class="vote-count" style="color:#ff4444">${p.down}</div></div>
                </div>
            </section>`;
    }).join('');

    // Hall Logic (Auto-Promotion)
    const pulse = filtered.filter(p => p.isPulse || getVibeStatus(p.up, p.down).label === "ELITE_VIBE");
    const stream = filtered.filter(p => !pulse.includes(p));

    const hallHtml = (data) => data.map(p => `
        <div class="tile ${getVibeStatus(p.up,p.down).label==='ELITE_VIBE'?'elite-border':''}">
            <h4>${p.name}</h4><div style="color:var(--lime); font-size:10px;">↑ ${p.up} <span style="color:#ff4444">↓ ${p.down}</span></div>
        </div>`).join('');
    
    document.getElementById('pulseGrid').innerHTML = hallHtml(pulse);
    document.getElementById('streamGrid').innerHTML = hallHtml(stream);
}

function vote(id, dir) {
    const p = projects.find(x => x.id === id);
    dir === 'up' ? p.up++ : p.down++;
    p.history.push(p.up - p.down);
    renderAll();
}

function openModal(id) {
    const p = projects.find(x => x.id === id);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const trendColor = p.history[p.history.length-1] >= p.history[0] ? (isDark?'var(--lime)':'#4c8000') : '#ff3b30';
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalBody').innerHTML = `<div class="trend-box" style="background:${isDark?'#000':'#f9f9fb'}"><span>VIBE_TREND</span>${generateSparkline(p.history, trendColor)}</div><p>${p.desc}</p>`;
    document.getElementById('projectModal').classList.remove('hidden');
}

function submitProject() {
    projects.unshift({ id: Date.now(), name: document.getElementById('pTitle').value || "NEW_VIBE", type: "NEW", up: 1, down: 0, isPulse: false, desc: document.getElementById('pDesc').value, img: lastUploadedImg, dim: document.getElementById('pDim').value/100, history: [1] });
    switchTab('arena');
}

function closeModal() { document.getElementById('projectModal').classList.add('hidden'); }
function toggleTheme() {
    const h = document.documentElement;
    h.setAttribute('data-theme', h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    renderAll();
}

renderAll();
