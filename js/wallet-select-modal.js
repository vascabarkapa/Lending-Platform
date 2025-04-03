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
                    showToast("WalletConnect support coming soon...", ToastType.INFO);
                    // connectWalletConnect();
                }

                if (e.target.closest("#connectWithoutWallet")) {
                    advancedConnect();
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
