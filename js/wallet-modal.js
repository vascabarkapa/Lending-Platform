function loadWalletInfoModal() {
    fetch('./components/shared/wallet-modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML("beforeend", html);

            document.addEventListener("click", (e) => {
                if (e.target.closest("#copyWalletBtn")) {
                    const user = JSON.parse(localStorage.getItem("walletUser") || "{}");
                    const address = user?.address;
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
                    localStorage.removeItem("walletUser");
                    location.reload();
                }
            });
        });
}
