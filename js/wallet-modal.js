function loadWalletInfoModal() {
    fetch('./components/shared/wallet-modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML("beforeend", html);

            const user = JSON.parse(localStorage.getItem("walletUser") || "{}");
            const userId = LocalStorage.getItem("userID");
            const address = user?.address;

            if (address) {
                document.getElementById("walletAddressDisplay").textContent = address;
            }

            const rbtc = LocalStorage.getRBTC();
            const usdc = LocalStorage.getUSDC();

            document.getElementById("wallerUserId").textContent = "User ID: " + userId;

            document.getElementById("rbtcAvailable").textContent = parseFloat(rbtc.AvailableFunds).toFixed(2);
            document.getElementById("rbtcReserved").textContent = parseFloat(rbtc.ReservedFunds).toFixed(2);
            document.getElementById("rbtcUsed").textContent = parseFloat(rbtc.UsedFunds).toFixed(2);

            document.getElementById("usdcAvailable").textContent = parseFloat(usdc.AvailableFunds).toFixed(2);
            document.getElementById("usdcReserved").textContent = parseFloat(usdc.ReservedFunds).toFixed(2);
            document.getElementById("usdcUsed").textContent = parseFloat(usdc.UsedFunds).toFixed(2);

            document.addEventListener("click", (e) => {
                if (e.target.closest("#copyWalletBtn")) {
                    if (address) {
                        navigator.clipboard.writeText(address).then(() => {
                            const icon = e.target.closest("button").querySelector("i");
                            const originalClass = icon.className;
                            icon.className = "bi bi-check-lg";
                            setTimeout(() => {
                                icon.className = originalClass;
                            }, 1500);
                        });
                    }
                }

                if (e.target && e.target.id === "disconnectWalletBtn") {
                    localStorage.clear();
                    location.reload();
                }
            });
        });
}
