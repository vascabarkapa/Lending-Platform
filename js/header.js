function loadHeader() {
    fetch('./components/shared/header.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('header-placeholder').innerHTML = html;

            const defaultSettings = {
                selected: "wss://node928.info:82",
                custom: "wss://",
                connected: false
            };

            const existingSettings = LocalStorage.getItem("wsSettings");
            if (!existingSettings) {
                LocalStorage.setItem("wsSettings", defaultSettings);
            }

            updateWsStatusIndicator();
            updateCurrentNodeDisplay();

            let currentPath = window.location.pathname.split('/').pop() || 'index.html';

            document.querySelectorAll('.nav-links a').forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });

            document.querySelectorAll('.offcanvas a').forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('text-primary');
                }
            });

            const connectBtn = document.getElementById("connectWalletBtn");
            const walletArea = document.getElementById("walletHeaderArea");
            const addressEl = document.getElementById("walletAddressDisplayHeader");
            const balanceEl = document.getElementById("walletBalanceDisplayHeader");

            const user = LocalStorage.getItem("walletUser");
            const userId = LocalStorage.getItem("userID");

            if (user && userId && walletArea && addressEl && balanceEl) {
                const parsed = user;
                const address = parsed.address;
                const balance = LocalStorage.getRBTC().AvailableFunds.toFixed(2) + " mRBTC";

                addressEl.innerHTML = `${shortenAddress(address)} <i class="bi bi-person-vcard ms-2 text-white-50"></i> <span class="text-white-50">${userId}</span>`;
                balanceEl.innerText = balance;

                walletArea.classList.remove("d-none");
                connectBtn.classList.add("d-none");
            }

            if (connectBtn) {
                connectBtn.addEventListener("click", () => {
                    const user = LocalStorage.getItem("walletUser");
                    const modalId = user ? "walletModal" : "walletSelectModal";

                    if (user) {
                        document.getElementById("walletModal")?.remove();

                        loadWalletInfoModal(() => {
                            const modalEl = document.getElementById("walletModal");
                            if (modalEl) {
                                const modal = new bootstrap.Modal(modalEl);
                                modal.show();
                            }
                        });
                    } else {
                        const modal = new bootstrap.Modal(document.getElementById(modalId));
                        modal.show();
                    }
                });
            }

            const walletClickable = document.getElementById("walletHeaderArea");
            if (walletClickable) {
                walletClickable.addEventListener("click", () => {
                    const user = LocalStorage.getItem("walletUser");
                    const modalId = user ? "walletModal" : "walletSelectModal";

                    if (user) {
                        document.getElementById("walletModal")?.remove();

                        loadWalletInfoModal(() => {
                            const modalEl = document.getElementById("walletModal");
                            if (modalEl) {
                                const modal = new bootstrap.Modal(modalEl);
                                modal.show();
                            }
                        });
                    } else {
                        const modal = new bootstrap.Modal(document.getElementById(modalId));
                        modal.show();
                    }
                });
            }
        });
}
