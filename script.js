// Dummy Data
const projects = [
    { name: "PULSE_DAO", score: "940", status: "FUNDED" },
    { name: "VIBE_TERMINAL", score: "820", status: "VOTING" },
    { name: "SOL_SHARD", score: "420", status: "PENDING" }
];

// 1. SCAN & LOGIN LOGIC
document.getElementById('scanBtn').onclick = function() {
    const address = document.getElementById('walletInput').value;
    const btn = this;
    const scanBar = btn.querySelector('.scan-bar');
    const btnText = btn.querySelector('.btn-text');

    if (!address) return;

    btnText.innerText = "SCANNING_VIBE...";
    scanBar.style.left = "0";

    // Transition after scan
    setTimeout(() => {
        document.getElementById('gateScreen').classList.add('hidden');
        document.getElementById('homeScreen').classList.remove('hidden');
        document.getElementById('balanceDisplay').innerText = "1,000,000,000 VIBE";
        loadArena();
    }, 1600);
};

// 2. TAB SWITCHING LOGIC
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    };
});

// 3. RENDER ARENA
function loadArena() {
    const grid = document.getElementById('projectGrid');
    grid.innerHTML = projects.map(p => `
        <div class="project-card">
            <div class="black-bg white-text" style="display:inline-block; padding:5px 10px; margin-bottom:10px;">${p.name}</div>
            <p>SCORE: <span class="lime-bg">${p.score}</span></p>
            <p style="font-size:12px; margin-top:10px;">STATUS: ${p.status}</p>
        </div>
    `).join('');
}
