async function connectMetaMask(successShouldCloseModal = false) {
    const overlay = document.getElementById("walletLoadingOverlay");
    const optionsArea = document.getElementById("walletOptionsArea");

    try {
        if (overlay) overlay.classList.remove("d-none");
        if (optionsArea) optionsArea.classList.add("blurred");

        if (typeof window.ethereum === "undefined") {
            showToast("MetaMask is not installed. Please install it first.", "info");
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
        LocalStorage.setItem("walletUser", userData);

        const msgHash = ethers.utils.hashMessage(message);
        const recoveredPubKey = ethers.utils.recoverPublicKey(msgHash, signature);

        const pubKeyBase64 = btoa(
            recoveredPubKey
                .replace(/^0x/, '')
                .match(/.{1,2}/g)
                .map(byte => String.fromCharCode(parseInt(byte, 16)))
                .join('')
        );

        try {
            const userID = await getUserIDFromPublicKey(pubKeyBase64);
            LocalStorage.setItem("userID", userID);
            await connectWebSocket();
            await getUserSettings();
        } catch (apiErr) {
            console.error("Failed to fetch user ID or connect WebSocket:", apiErr);
            showToast("Connected wallet, but failed to fetch user ID or WebSocket.", "error");
            return;
        }

        const connectBtn = document.getElementById("connectWalletBtn");
        const walletArea = document.getElementById("walletHeaderArea");
        const addressEl = document.getElementById("walletAddressDisplayHeader");
        const balanceEl = document.getElementById("walletBalanceDisplayHeader");

        if (walletArea && addressEl && balanceEl) {
            addressEl.innerHTML = `${shortenAddress(account)} <i class="bi bi-person-vcard ms-2 text-white-50"></i> <span class="text-white-50">${LocalStorage.getItem("userID")}</span>`;
            balanceEl.innerText = "1.00 mRBTC";
            walletArea.classList.remove("d-none");
            connectBtn?.classList.add("d-none");
        }

        if (successShouldCloseModal) {
            const modal = bootstrap.Modal.getInstance(document.getElementById("walletSelectModal"));
            if (modal) modal.hide();
        }

        const res = await fetch('./components/home/dashboard.html');
        const html = await res.text();
        document.getElementById("page-content").innerHTML = html;

    } catch (err) {
        console.error("Wallet connect error:", err);
        showToast("Wallet connection failed.", "error");
    } finally {
        if (overlay) overlay.classList.add("d-none");
        if (optionsArea) optionsArea.classList.remove("blurred");
    }
}
