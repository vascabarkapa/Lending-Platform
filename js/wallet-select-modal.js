function loadWalletSelectModal() {
    fetch('./components/shared/wallet-select-modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML("beforeend", html);

            document.addEventListener("click", (e) => {
                if (e.target.closest("#chooseMetaMask")) {
                    connectMetaMask(true);
                }

                if (e.target.closest("#chooseWalletConnect")) {
                    showToast("WalletConnect support coming soon...", "info");
                }

                if (e.target.closest("#connectWithoutWallet")) {
                    showToast("Advanced login without wallet coming soon...", "info");
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
