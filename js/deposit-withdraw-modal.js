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

            // Reset modal inputs & views on close
            modalEl.addEventListener("hidden.bs.modal", () => {
                resetModalViews();
                modalEl.querySelectorAll("input").forEach(input => {
                    input.value = "";
                });
            });
        });
}

function resetModalViews() {
    document.getElementById("depositWithdrawSelection")?.classList.remove("d-none");
    document.getElementById("depositView")?.classList.add("d-none");
    document.getElementById("withdrawView")?.classList.add("d-none");
}

function showView(type) {
    document.getElementById("depositWithdrawSelection")?.classList.add("d-none");
    document.getElementById("depositView")?.classList.toggle("d-none", type !== "deposit");
    document.getElementById("withdrawView")?.classList.toggle("d-none", type !== "withdraw");

    if (type === "withdraw") {
        const user = LocalStorage.getItem("walletUser");
        if (user?.address) {
            const addressInput = document.getElementById("withdrawAddressInput");
            if (addressInput) {
                addressInput.value = user.address;
            }
        }
    }
}
