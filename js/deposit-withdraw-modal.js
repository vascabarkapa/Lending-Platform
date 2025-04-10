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
        document.getElementById("selectRBTC")?.click(); // default withdraw: RBTC
    } else if (type === "deposit") {
        handleDepositCurrencySelection();
        document.getElementById("selectBitcoin")?.click(); // default deposit: Bitcoin
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
                addressInput.placeholder = "bc1...";
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

            // U budućnosti se ovdje može prikazivati dinamička mreža, ruta ili info o fee-u
            // console.log("Selected for deposit:", selectedCurrency);
        });
    });
}
