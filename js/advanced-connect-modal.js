function advancedConnect() {
    const existing = document.getElementById("advancedConnectModal");
    if (existing) {
        const modal = new bootstrap.Modal(existing);
        modal.show();
        return;
    }

    fetch('./components/shared/advanced-connect-modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML('beforeend', html);

            const modal = new bootstrap.Modal(document.getElementById("advancedConnectModal"));
            modal.show();

            setupAdvancedConnectHandlers();
        });
}

function setupAdvancedConnectHandlers() {
    document.addEventListener("click", async (e) => {
        if (e.target.closest("#submitPrivateKeyBtn")) {
            const input = document.getElementById("privateKeyInput");
            const errorEl = document.getElementById("privateKeyError");
            const key = input.value.trim();

            if (!/^0x[a-fA-F0-9]{64}$/.test(key)) {
                errorEl.style.display = "block";
                errorEl.textContent = "Invalid Private Key. It must be a 32-byte hexadecimal string starting with 0x.";
                return;
            }

            errorEl.style.display = "none";
            showEncryptionStep(key);
        }

        if (e.target.id === "storeKeyBtn") {
            const pass = document.getElementById("encryptionPass").value;
            const confirm = document.getElementById("encryptionConfirmPass").value;

            if (!pass || pass !== confirm) {
                showToast("Passwords do not match", ToastType.ERROR);
                return;
            }

            const encrypted = btoa(unescape(encodeURIComponent(JSON.stringify({
                privateKey: window.tempPrivateKey,
                password: pass
            }))));

            try {
                const wallet = new ethers.Wallet(window.tempPrivateKey);
                const account = wallet.address;
                const domain = window.location.hostname;
                const nonce = Math.floor(Math.random() * 1000000);
                const timestamp = new Date().toISOString();
                const message = `Please, make sure that you are signing this message on Lending Platform domain: ${domain}\n\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
                const signature = await wallet.signMessage(message);

                const msgHash = ethers.utils.hashMessage(message);
                const recoveredPubKey = ethers.utils.recoverPublicKey(msgHash, signature);
                const pubKeyBase64 = btoa(recoveredPubKey.replace(/^0x/, '')
                    .match(/.{1,2}/g)
                    .map(byte => String.fromCharCode(parseInt(byte, 16)))
                    .join(''));

                const userID = await getUserIDFromPublicKey(pubKeyBase64);

                LocalStorage.setItem("walletUser", {address: account, signature, nonce, timestamp});
                LocalStorage.setItem("userID", userID);
                LocalStorage.setItem("encryptedPK", encrypted);

                await connectWebSocket();
                await getUserSettings();

                const addressEl = document.getElementById("walletAddressDisplayHeader");
                const balanceEl = document.getElementById("walletBalanceDisplayHeader");
                const walletArea = document.getElementById("walletHeaderArea");
                const connectBtn = document.getElementById("connectWalletBtn");

                if (walletArea && addressEl && balanceEl) {
                    addressEl.innerHTML = `${shortenAddress(account)} <i class="bi bi-person-vcard ms-2 text-white-50"></i> <span class="text-white-50">${userID}</span>`;
                    balanceEl.innerText = "0.00 mRBTC";
                    walletArea.classList.remove("d-none");
                    connectBtn?.classList.add("d-none");
                }

                const selectModal = bootstrap.Modal.getInstance(document.getElementById("walletSelectModal"));
                const advancedModal = bootstrap.Modal.getInstance(document.getElementById("advancedConnectModal"));
                selectModal?.hide();
                advancedModal?.hide();

                const res = await fetch('./components/home/dashboard.html');
                const html = await res.text();
                document.getElementById("page-content").innerHTML = html;
                renderDashboardBalances();

            } catch (err) {
                console.error("Private key login error", err);
                showToast("Failed to complete login.", ToastType.ERROR);
            }
        }
    });
}

function showEncryptionStep(privateKey) {
    window.tempPrivateKey = privateKey;

    const body = document.getElementById("advancedModalBody");
    body.innerHTML = `
        <p class="text-secondary small mb-3"><strong>Protect your keys.</strong> Choose a password to encrypt your keys. This password will be used to unlock your keys.</p>

        <div class="row mb-4">
            <div class="col-md-6">
                <label class="form-label" for="encryptionPass">Password</label>
                <input type="password" id="encryptionPass" class="form-control bg-dark text-light input-primary" />
            </div>
            <div class="col-md-6">
                <label class="form-label" for="encryptionConfirmPass">Confirm Password</label>
                <input type="password" id="encryptionConfirmPass" class="form-control bg-dark text-light input-primary" />
            </div>
        </div>

        <button class="btn btn-primary w-100 py-2 rounded-3" id="storeKeyBtn">Store my Keys</button>
    `;
}
