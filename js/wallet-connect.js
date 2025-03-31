async function connectMetaMask(successShouldCloseModal = false) {
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

        console.log("Base64 PublicKey:", pubKeyBase64);

        try {
            const userID = await getUserIDFromPublicKey(pubKeyBase64);
            LocalStorage.setItem("userID", userID);
            console.log("User ID:", userID);
        } catch (apiErr) {
            console.error("Failed to fetch user ID from public key:", apiErr);
            alert("Connected wallet, but failed to fetch user ID.");
        }

        const connectBtn = document.getElementById("connectWalletBtn");
        if (connectBtn) {
            connectBtn.innerHTML = `<i class="bi bi-person-check"></i> <span class="d-none d-md-inline ms-1">${shortenAddress(account)}</span>`;
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
        alert("Wallet connection failed.");
    } finally {
        if (overlay) overlay.classList.add("d-none");
        if (optionsArea) optionsArea.classList.remove("blurred");
    }
}
