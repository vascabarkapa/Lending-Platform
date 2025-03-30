function loadWalletSelectModal() {
    fetch('./components/shared/wallet-select-modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML("beforeend", html);

            document.addEventListener("click", (e) => {
                if (e.target.closest("#chooseMetaMask")) {
                    connectWalletFlow(true);
                }

                if (e.target.closest("#chooseWalletConnect")) {
                    alert("WalletConnect support coming soon...");
                }

                if (e.target.closest("#connectWithoutWallet")) {
                    alert("Advanced login without wallet coming soon...");
                }
            });
        });

    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "connectWalletBtnSecondary") {
            const btn = document.getElementById("connectWalletBtn");
            if (btn) btn.click();
        }
    });
}
