function connectWalletFlow(successShouldCloseModal = false) {
    const overlay = document.getElementById("walletLoadingOverlay");
    const optionsArea = document.getElementById("walletOptionsArea");

    try {
        if (overlay) overlay.classList.remove("d-none");
        if (optionsArea) optionsArea.classList.add("blurred");

        if (typeof window.ethereum === "undefined") {
            alert("MetaMask is not installed. Please install it first.");
            return;
        }

        window.ethereum.request({ method: "eth_requestAccounts" }).then(async (accounts) => {
            const account = accounts[0];
            const domain = window.location.hostname;
            const nonce = Math.floor(Math.random() * 1000000);
            const timestamp = new Date().toISOString();
            const message = `Please, make sure that you are signing this message on Bitcoin Betting domain: ${domain}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;

            const signature = await window.ethereum.request({
                method: "personal_sign",
                params: [message, account],
            });

            const userData = { address: account, signature, nonce, timestamp };
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
        });
    } catch (err) {
        console.error("Wallet connect error:", err);
        alert("Wallet connection failed.");
    } finally {
        if (overlay) overlay.classList.add("d-none");
        if (optionsArea) optionsArea.classList.remove("blurred");
    }
}
