function loadDepositWithdrawModal() {
    fetch('./components/shared/deposit-withdraw-modal.html')
        .then(res => res.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);

            const btn = document.getElementById("openDepositWithdrawModalBtn");
            if (btn) {
                btn.addEventListener("click", () => {
                    resetModalViews();
                    const modal = new bootstrap.Modal(document.getElementById("depositWithdrawModal"));
                    modal.show();
                });
            }

            const user = LocalStorage.getItem("walletUser");
            const userId = LocalStorage.getItem("userID");
            if (user && userId) {
                btn?.classList.remove("d-none");
            }

            document.addEventListener("click", (e) => {
                if (e.target.closest("#chooseDeposit")) {
                    showView("deposit");
                } else if (e.target.closest("#chooseWithdraw")) {
                    showView("withdraw");
                }
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
}
