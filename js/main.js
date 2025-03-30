function shortenAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Load header
fetch('./components/shared/header.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('header-placeholder').innerHTML = html;

        const currentPath = window.location.pathname.split('/').pop();

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
        const user = localStorage.getItem("walletUser");

        if (user && connectBtn) {
            const parsed = JSON.parse(user);
            connectBtn.innerHTML = `<i class="bi bi-person-check"></i> <span class="d-none d-md-inline ms-1">${shortenAddress(parsed.address)}</span>`;
        }

        if (connectBtn) {
            connectBtn.addEventListener("click", () => {
                const user = localStorage.getItem("walletUser");

                if (user) {
                    const parsed = JSON.parse(user);
                    const modal = new bootstrap.Modal(document.getElementById("walletModal"));
                    document.getElementById("walletAddressDisplay").innerText = shortenAddress(parsed.address);
                    modal.show();
                } else {
                    const modal = new bootstrap.Modal(document.getElementById("walletSelectModal"));
                    modal.show();
                }
            });
        }
    });

// Load footer
fetch('./components/shared/footer.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('footer-placeholder').innerHTML = html;
    });

// Load main page content (dashboard or connect screen)
const user = localStorage.getItem("walletUser");
const homePage = user
    ? './components/home/dashboard.html'
    : './components/home/content.html';

fetch(homePage)
    .then(res => res.text())
    .then(html => {
        document.getElementById('page-content').innerHTML = html;
    });

// Load wallet info modal
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

// Load wallet select modal
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

// Wallet login flow with spinner
async function connectWalletFlow(successShouldCloseModal = false) {
    const overlay = document.getElementById("walletLoadingOverlay");
    const optionsArea = document.getElementById("walletOptionsArea");

    try {
        if (overlay) overlay.classList.remove("d-none");
        if (optionsArea) optionsArea.classList.add("blurred");

        if (typeof window.ethereum === "undefined") {
            alert("MetaMask is not installed. Please install it first.");
            return;
        }

        const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
        const account = accounts[0];

        const domain = window.location.hostname;
        const nonce = Math.floor(Math.random() * 1000000);
        const timestamp = new Date().toISOString();
        const message = `Please, make sure that you are signing this message on Bitcoin Betting domain: ${domain}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;

        const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [message, account],
        });

        const userData = {address: account, signature, nonce, timestamp};
        localStorage.setItem("walletUser", JSON.stringify(userData));

        const connectBtn = document.getElementById("connectWalletBtn");
        if (connectBtn) {
            connectBtn.innerHTML = `<i class="bi bi-person-check"></i> <span class="d-none d-md-inline ms-1">${shortenAddress(account)}</span>`;
        }

        if (successShouldCloseModal) {
            const modal = bootstrap.Modal.getInstance(document.getElementById("walletSelectModal"));
            if (modal) modal.hide();
        }

        fetch('./components/home/dashboard.html')
            .then(res => res.text())
            .then(html => {
                const pageContent = document.getElementById("page-content");
                if (pageContent) pageContent.innerHTML = html;
            });

        console.log("Connected:", userData);
    } catch (err) {
        console.error("Wallet connect error:", err);
        alert("Wallet connection failed.");
    } finally {
        if (overlay) overlay.classList.add("d-none");
        if (optionsArea) optionsArea.classList.remove("blurred");
    }
}

// Secondary button triggers same connect flow
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "connectWalletBtnSecondary") {
        const btn = document.getElementById("connectWalletBtn");
        if (btn) btn.click();
    }
});
