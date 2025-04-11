let realPrivateKey = "";

function advancedConnect() {
    const existing = document.getElementById("advancedConnectModal");
    if (existing) {
        const modal = new bootstrap.Modal(existing);
        modal.show();
        setupPrivateKeyMasking();
        setupAdvancedConnectHandlers();

        existing.addEventListener("hidden.bs.modal", () => {
            realPrivateKey = "";
            window.tempPrivateKey = "";
            const body = document.getElementById("advancedModalBody");
            if (body) showPrivateKeyStep();
        });

        return;
    }

    fetch('./components/shared/advanced-connect-modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML('beforeend', html);
            const modalEl = document.getElementById("advancedConnectModal");
            const modal = new bootstrap.Modal(modalEl);
            modal.show();

            setupPrivateKeyMasking();
            setupAdvancedConnectHandlers();

            modalEl.addEventListener("hidden.bs.modal", () => {
                realPrivateKey = "";
                window.tempPrivateKey = "";
                const body = document.getElementById("advancedModalBody");
                if (body) showPrivateKeyStep();
            });
        });
}

function setupPrivateKeyMasking() {
    const inputEl = document.getElementById("privateKeyInput");
    realPrivateKey = "";

    inputEl.addEventListener("input", (e) => {
        const input = e.target;
        const currentDisplay = input.value;
        const prevLength = parseInt(input.dataset.prevLength || 0);

        if (currentDisplay.length > prevLength) {
            const addedChar = currentDisplay.replace(/\*/g, "").slice(-1);
            realPrivateKey += addedChar;
        } else if (currentDisplay.length < prevLength) {
            const diff = prevLength - currentDisplay.length;
            realPrivateKey = realPrivateKey.slice(0, -diff);
        }

        const visible = realPrivateKey.slice(0, 5);
        const masked = "*".repeat(Math.max(realPrivateKey.length - 5, 0));
        input.value = visible + masked;
        input.dataset.prevLength = input.value.length;
        input.setSelectionRange(input.value.length, input.value.length);
    });

    inputEl.onpaste = (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/\s/g, "");
        realPrivateKey += pasted;

        const visible = realPrivateKey.slice(0, 5);
        const masked = "*".repeat(Math.max(realPrivateKey.length - 5, 0));
        inputEl.value = visible + masked;
        inputEl.dataset.prevLength = inputEl.value.length;
        inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
    };

    inputEl.onfocus = () => {
        inputEl.dataset.prevLength = inputEl.value.length;
    };
}

function setupAdvancedConnectHandlers() {
    document.addEventListener("click", async (e) => {
        if (e.target.closest("#submitPrivateKeyBtn")) {
            const errorEl = document.getElementById("privateKeyError");
            const key = realPrivateKey.trim();

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
            const storeBtn = document.getElementById("storeKeyBtn");

            storeBtn.disabled = true;
            storeBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Storing...`;

            if (!pass || pass !== confirm) {
                showToast("Passwords do not match", ToastType.ERROR);
                storeBtn.disabled = false;
                storeBtn.innerHTML = `Store my Keys`;
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

                if (!userID || typeof userID !== "number") {
                    showToast("Invalid public key. Could not retrieve user ID.", ToastType.ERROR);
                    storeBtn.disabled = false;
                    storeBtn.innerHTML = `Store my Keys`;
                    showPrivateKeyStep();
                    return;
                }

                LocalStorage.setItem("walletUser", { address: account, signature, nonce, timestamp });
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
                //initPlaceOrderForm();
            } catch (err) {
                console.error("Private key login error", err);
                showToast("Failed to complete login.", ToastType.ERROR);
                showPrivateKeyStep();
            } finally {
                storeBtn.disabled = false;
                storeBtn.innerHTML = `Store my Keys`;
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

function showPrivateKeyStep() {
    realPrivateKey = "";
    window.tempPrivateKey = "";

    const body = document.getElementById("advancedModalBody");
    body.innerHTML = `
        <p class="text-secondary small mb-4">
            If you are using MetaMask, check <a
                href="https://support.metamask.io/configure/accounts/how-to-export-an-accounts-private-key/"
                target="_blank" class="text-primary text-decoration-none">how to export your private key</a> guide.
            If you are using another wallet, please refer to their documentation.
        </p>

        <div class="text-danger fw-semibold small mb-3">
            Exporting and using private keys directly in the browser poses major security risks...
        </div>

        <ul class="text-danger small mb-4 ps-3">
            <li>Never use this on a public computer.</li>
            <li>Only use on a trusted browser with only trusted extensions.</li>
            <li>Always backup your private key securely.</li>
            <li>Ensure you are familiar with the risks of managing your own private keys.</li>
            <li>Your private key will be persisted on disk in the end...</li>
        </ul>

        <div class="mb-4 mb-3">
            <input type="text" id="privateKeyInput" class="form-control bg-dark text-light input-primary" autocomplete="off"
                   placeholder="0x123123123123123..." />
            <div class="invalid-feedback d-block mt-1 ms-1 small" id="privateKeyError" style="display: none; font-size: 0.8em;"></div>
        </div>

        <button class="btn btn-primary w-100 py-2 rounded-3" id="submitPrivateKeyBtn">
            Connect with Private Key
        </button>
    `;

    setupPrivateKeyMasking();
}
