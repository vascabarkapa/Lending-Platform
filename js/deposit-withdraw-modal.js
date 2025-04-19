function loadDepositWithdrawModal() {
    const user = LocalStorage.getItem("walletUser");
    const userId = LocalStorage.getItem("userID");

    if (!user || !userId) return;

    fetch('./components/shared/deposit-withdraw-modal.html')
        .then(res => res.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);

            const btn = document.getElementById("openDepositWithdrawModalBtn");
            const modalEl = document.getElementById("depositWithdrawModal");

            if (btn) {
                btn.addEventListener("click", () => {
                    resetModalViews();
                    const modal = new bootstrap.Modal(modalEl);
                    modal.show();

                    const form = document.querySelector('#depositView form');
                    if (form) {
                        const csrfInput = form.querySelector('input[name="__RequestVerificationToken"]');
                        const amountInput = form.querySelector('input[name="amount"]');
                        const orderIdInput = form.querySelector('input[name="orderId"]');
                        const userAmountInput = document.querySelector('#depositView input[type="number"]');
                        const submitBtn = form.querySelector('button[type="submit"]');

                        if (csrfInput) csrfInput.value = generateCSRFToken();
                        if (orderIdInput) orderIdInput.value = userId;

                        if (userAmountInput && amountInput) {
                            const validateAmount = () => {
                                const value = parseFloat(userAmountInput.value);
                                if (isNaN(value) || value <= 0) {
                                    if (submitBtn) submitBtn.disabled = true;
                                } else {
                                    amountInput.value = (parseFloat(userAmountInput.value) / 1000);
                                    if (submitBtn) submitBtn.disabled = false;
                                }
                            };

                            userAmountInput.addEventListener('input', validateAmount);

                            form.addEventListener('submit', (e) => {
                                const value = parseFloat(userAmountInput.value);
                                if (isNaN(value) || value <= 0) {
                                    e.preventDefault();
                                    showToast("Amount must be greater than 0", ToastType.ERROR);
                                }
                            });

                            validateAmount();
                        }
                    }
                });
                btn.classList.remove("d-none");
            }

            document.addEventListener("click", (e) => {
                if (e.target.closest("#chooseDeposit")) {
                    showView("deposit");
                } else if (e.target.closest("#chooseWithdraw")) {
                    showView("withdraw");
                }
            });

            modalEl.addEventListener("hidden.bs.modal", () => {
                resetModalViews();
                modalEl.querySelectorAll("input").forEach(input => input.value = "");
                clearCurrencySelection();
            });
        });
}

function resetModalViews() {
    document.getElementById("depositWithdrawSelection")?.classList.remove("d-none");
    document.getElementById("depositView")?.classList.add("d-none");
    document.getElementById("withdrawView")?.classList.add("d-none");
}

function clearCurrencySelection() {
    document.querySelectorAll(".withdraw-currency-btn, .deposit-currency-btn").forEach(btn =>
        btn.classList.remove("active-currency")
    );
}

function showView(type) {
    document.getElementById("depositWithdrawSelection")?.classList.add("d-none");
    document.getElementById("depositView")?.classList.toggle("d-none", type !== "deposit");
    document.getElementById("withdrawView")?.classList.toggle("d-none", type !== "withdraw");

    if (type === "withdraw") {
        handleWithdrawCurrencySelection();
        document.getElementById("selectRBTC")?.click();
    } else if (type === "deposit") {
        handleDepositCurrencySelection();
        document.getElementById("selectBitcoin")?.click();
    }
}

function handleWithdrawCurrencySelection() {
    const currencyButtons = document.querySelectorAll(".withdraw-currency-btn");

    currencyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedCurrency = btn.dataset.currency;

            currencyButtons.forEach(b => b.classList.remove("active-currency"));
            btn.classList.add("active-currency");

            const addressLabel = document.getElementById("withdrawAddressLabel");
            const addressInput = document.getElementById("withdrawAddressInput");
            const tipText = document.getElementById("withdrawTip");
            const currency = document.getElementById("currentWithdrawCurrency");

            if (selectedCurrency === "RBTC") {
                addressLabel.textContent = "Blockchain address";
                addressInput.placeholder = "0x123123...";
                addressInput.value = LocalStorage.getItem("walletUser")?.address || "";
                tipText.innerHTML = `<strong>Tip</strong>: You need to have enough RBTC in your wallet to cover the network transaction costs. Please note that these prices fluctuate a lot according to network conditions.`;
                currency.innerHTML = "mRBTC";
            } else if (selectedCurrency === "BTC") {
                addressLabel.textContent = "Bitcoin Address";
                addressInput.placeholder = "0x123123...";
                addressInput.value = "";
                tipText.innerHTML = `The <strong>Fees</strong> charged withdrawing to Bitcoin is <strong>0.1 mBTC</strong>.`;
                currency.innerHTML = "mBTC";
            }
        });
    });
}

function handleDepositCurrencySelection() {
    const currencyButtons = document.querySelectorAll(".deposit-currency-btn");

    currencyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedCurrency = btn.dataset.currency;

            currencyButtons.forEach(b => b.classList.remove("active-currency"));
            btn.classList.add("active-currency");
        });
    });
}
