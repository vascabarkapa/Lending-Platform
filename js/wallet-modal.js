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

            document.getElementById("rbtcAvailable").textContent = formatAmount(rbtc.AvailableFunds);
            document.getElementById("rbtcReserved").textContent = formatAmount(rbtc.ReservedFunds);
            document.getElementById("rbtcUsed").textContent = formatAmount(rbtc.UsedFunds);

            document.getElementById("usdcAvailable").textContent = formatAmount(usdc.AvailableFunds);
            document.getElementById("usdcReserved").textContent = formatAmount(usdc.ReservedFunds);
            document.getElementById("usdcUsed").textContent = formatAmount(usdc.UsedFunds);

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
