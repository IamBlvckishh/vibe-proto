let projects = [
    { id: 1, name: "ALPHA_LEAK", type: "DEFI", up: 550, down: 10, isPulse: true, desc: "Yield aggregator for vibe holders.", img: "", dim: 0.7, history: [400, 420, 450, 500, 550] },
    { id: 2, name: "PIXEL_MINT", type: "NFT", up: 120, down: 45, isPulse: false, desc: "Generative art engine.", img: "", dim: 0.8, history: [150, 140, 130, 125, 120] }
];

let lastUploadedImg = "";

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId + 'Tab').classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function handleImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => lastUploadedImg = e.target.result;
        reader.readAsDataURL(input.files[0]);
    }
}

function updateDimLabel(val) { document.getElementById('dimVal').innerText = val; }

function getVibeStatus(up, down) {
    const total = up + down;
    const ratio = up / (total || 1);
    if (up > 500 && ratio > 0.9) return { label: "ELITE_VIBE", class: "vibe-elite" };
    if (ratio > 0.7) return { label: "HIGH_VIBE", class: "vibe-high" };
    return ratio > 0.4 ? { label: "NEUTRAL", class: "" } : { label: "LOW_VIBE", class: "vibe-low" };
}

function generateSparkline(history, color) {
    const min = Math.min(...history), max = Math.max(...history), range = max - min || 1;
    const points = history.map((v, i) => `${(i/(history.length-1))*100},${30-((v-min)/range)*30}`).join(' ');
    return `<svg width="100%" height="30" viewBox="0 0 100 30" preserveAspectRatio="none"><polyline fill="none" stroke="${color}" stroke-width="2" points="${points}"/></svg>`;
}

function renderAll() {
    const type = document.getElementById('typeFilter').value;
    const arena = document.getElementById('arenaTab');
    const filtered = type === 'ALL' ? projects : projects.filter(p => p.type === type);

    arena.innerHTML = filtered.map(p => {
        const vibe = getVibeStatus(p.up, p.down);
        return `
            <section class="art-card" onclick="openModal(${p.id})" style="background-image:url('${p.img}'); --card-dim:${p.dim}">
                <div class="vibe-status ${vibe.class}">${vibe.label}</div>
                <div class="terminal">
                    <small style="color:var(--lime)">${p.type}</small>
                    <h2 style="font-size:32px; margin:10px 0;">${p.name}</h2>
                    <p style="font-size:12px; opacity:0.9;">${p.desc}</p>
                </div>
                <div class="vote-stack" onclick="event.stopPropagation()">
                    <div class="vote-group">
                        <button class="v-btn up" onclick="vote(${p.id}, 'up')">↑</button>
                        <div class="vote-count" style="color:var(--lime)">${p.up}</div>
                    </div>
                    <div class="vote-group">
                        <button class="v-btn down" onclick="vote(${p.id}, 'down')">↓</button>
                        <div class="vote-count" style="color:#ff4444">${p.down}</div>
                    </div>
                </div>
            </section>
        `;
    }).join('');

    const pulseProjects = filtered.filter(p => p.isPulse || getVibeStatus(p.up, p.down).label === "ELITE_VIBE");
    const streamProjects = filtered.filter(p => !pulseProjects.includes(p));

    const hallHtml = (data) => data.map(p => `<div class="tile ${getVibeStatus(p.up,p.down).label==='ELITE_VIBE'?'elite-border':''}">
        <h4>${p.name}</h4><div style="color:var(--lime)">↑ ${p.up} <span style="color:#ff4444">↓ ${p.down}</span></div></div>`).join('');
    
    document.getElementById('pulseGrid').innerHTML = hallHtml(pulseProjects);
    document.getElementById('streamGrid').innerHTML = hallHtml(streamProjects);
}

function vote(id, dir) {
    const p = projects.find(x => x.id === id);
    dir === 'up' ? p.up++ : p.down++;
    p.history.push(p.up - p.down);
    renderAll();
}

function openModal(id) {
    const p = projects.find(x => x.id === id);
    const color = p.history[p.history.length-1] >= p.history[0] ? 'var(--lime)' : '#ff4444';
    document.getElementById('modalTitle').innerText = p.name;
    document.getElementById('modalBody').innerHTML = `<div class="trend-box"><span>TREND</span>${generateSparkline(p.history, color)}</div><p>${p.desc}</p>`;
    document.getElementById('projectModal').classList.remove('hidden');
}

function submitProject() {
    projects.push({ id: Date.now(), name: document.getElementById('pTitle').value, type: "NEW", up: 1, down: 0, isPulse: false, desc: document.getElementById('pDesc').value, img: lastUploadedImg, dim: document.getElementById('pDim').value/100, history: [1] });
    switchTab('arena'); renderAll();
}

function closeModal() { document.getElementById('projectModal').classList.add('hidden'); }
function toggleTheme() { const h = document.documentElement; h.setAttribute('data-theme', h.getAttribute('data-theme')==='dark'?'light':'dark'); }

renderAll();
