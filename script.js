document.getElementById('scanBtn').onclick = function() {
    const address = document.getElementById('walletInput').value;
    const btn = this;
    const scanBar = btn.querySelector('.scan-bar');
    const btnText = btn.querySelector('.btn-text');

    if (address.trim() === "") {
        alert("ERROR: WALLET_ADDRESS_REQUIRED");
        return;
    }

    // Start Scan Animation
    btnText.innerText = "SCANNING_BLOCKCHAIN...";
    btn.style.backgroundColor = "#eee";
    scanBar.style.left = "0";

    // Simulate Scan Completion
    setTimeout(() => {
        btnText.innerText = "VIBE_CONFIRMED";
        btnText.style.color = "black";
        
        // After success, you could redirect or unlock the next screen
        setTimeout(() => {
            alert("SUCCESS: Wallet " + address.substring(0, 6) + "... Connected.");
        }, 500);
        
    }, 2000); // 2 second scan time
};
