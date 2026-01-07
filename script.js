let projects = [
    { id: 1, name: "pepe_vibe", type: "NFT", up: 720, down: 20, desc: "original vibe curator.", img: "", dim: 0.6, isPulse: true },
    { id: 2, name: "moon_tool", type: "TOOL", up: 450, down: 120, desc: "track your aura in real-time.", img: "", dim: 0.7, isPulse: false },
    { id: 3, name: "alpha_dex", type: "DEFI", up: 950, down: 5, desc: "fastest swaps on the planet.", img: "", dim: 0.5, isPulse: true },
    { id: 4, name: "aura_scan", type: "TOOL", up: 150, down: 180, desc: "detect low vibes instantly.", img: "", dim: 0.8, isPulse: false },
    { id: 5, name: "pixel_club", type: "NFT", up: 310, down: 10, desc: "generative pixels with soul.", img: "", dim: 0.7, isPulse: false }
];

let lastUploadedImg = "";

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId + 'Tab').classList.remove('hidden');
    event.currentTarget.classList.add('active');
    renderAll();
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
    const ratio = up / ((up + down) || 1);
    if (up > 500 && ratio > 0.9) return { label: "ELITE_VIBE", class: "vibe-elite" };
    if (ratio > 0.6) return { label: "HIGH_VIBE", class: "" };
    return { label: "LOW_VIBE", class: "vibe-low" };
}

function pushToFeed(projName, type) {
    const wrapper = document.getElementById('liveFeedWrapper');
    const colorClass = type === 'up' ? 'feed-up' : 'feed-down';
    const symbol = type === 'up' ? '▲' : '▼';
    const newItem = document.createElement('span');
    newItem.className = `feed-item ${colorClass}`;
    newItem.innerHTML = `[${symbol}] ${projName} JUST_VOTED`;
    wrapper.prepend(newItem);
    if(wrapper.children.length > 20) wrapper.lastChild.remove();
}

function renderAll() {
    const arena = document.getElementById('arenaTab');
    const type = document.getElementById('typeFilter').value;
    const filtered = projects.filter(p => type === 'ALL' || p.type === type);

    arena.innerHTML = filtered.map(p => {
        const vibe = getVibeStatus(p.up, p.down);
        const progress = Math.min((p.up / 1000) * 100, 100);
        return `
            <section class="art-card" style="background-image:url('${p.img}');">
                <div class="terminal">
                    <div style="display:flex; gap:12px;">
                        <div style="width:80px; height:80px; background:#000; border-radius:6px; overflow:hidden; border:1px solid var(--border);">
                            <img src="${p.img || 'https://via.placeholder.com/80/000/86efac?text=' + p.name[0]}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                        <div style="flex:1">
                            <div style="display:flex; justify-content:space-between;">
                                <span class="vibe-status ${vibe.class}">${vibe.label}</span>
                                <small style="color:var(--pump-green); font-size:10px;">${p.type}</small>
                            </div>
                            <h2 style="font-size:16px; margin:4px 0; color:#fff;">${p.name}</h2>
                            <p style="font-size:11px; color:var(--pump-gray); line-height:1.3;">${p.desc}</p>
                        </div>
                    </div>
                    <div style="margin-top:12px;">
                        <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:4px; color:var(--pump-green); font-weight:800;">
                            <span>bonding curve progress: ${progress.toFixed(1)}%</span>
                        </div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${progress}%"></div></div>
                        <div style="font-size:10px; color:var(--pump-gray);">score: ${p.up - p.down} vibes</div>
                    </div>
                </div>
                <div class="vote-stack" onclick="event.stopPropagation()">
                    <div class="vote-group">
                        <button class="v-btn up" onclick="vote(${p.id}, 'up')">↑</button>
                        <div class="vote-count" style="color:var(--pump-green)">${p.up}</div>
                    </div>
                    <div class="vote-group">
                        <button class="v-btn down" onclick="vote(${p.id}, 'down')">↓</button>
                        <div class="vote-count" style="color:var(--pump-red)">${p.down}</div>
                    </div>
                </div>
            </section>
        `;
    }).join('');

    const pulse = filtered.filter(p => p.isPulse || getVibeStatus(p.up, p.down).label === 'ELITE_VIBE');
    const stream = filtered.filter(p => !pulse.includes(p));
    
    const tileHtml = (data) => data.map(p => `<div class="tile" style="background:#1b1d23; border:1px solid var(--border); padding:10px; border-radius:8px; margin-bottom:8px;">
        <h4 style="color:var(--pump-green); font-size:14px;">${p.name}</h4><div style="font-size:11px;">score: ${p.up - p.down}</div></div>`).join('');
    
    document.getElementById('pulseGrid').innerHTML = tileHtml(pulse);
    document.getElementById('streamGrid').innerHTML = tileHtml(stream);
}

function vote(id, dir) {
    const p = projects.find(x => x.id === id);
    dir === 'up' ? p.up++ : p.down++;
    pushToFeed(p.name, dir);
    const toast = document.getElementById('assetToast');
    toast.style.opacity = 1;
    setTimeout(() => toast.style.opacity = 0, 800);
    renderAll();
}

function submitProject() {
    projects.unshift({ id: Date.now(), name: document.getElementById('pTitle').value || "new_vibe", type: "NEW", up: 1, down: 0, desc: document.getElementById('pDesc').value, img: lastUploadedImg, dim: 0.7, isPulse: false });
    switchTab('arena');
}

renderAll();
