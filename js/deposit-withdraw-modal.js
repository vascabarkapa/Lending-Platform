function loadDepositWithdrawModal() {
    fetch('./components/shared/deposit-withdraw-modal.html')
        .then(res => res.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);

            const btn = document.getElementById("openDepositWithdrawModalBtn");
            if (btn) {
                btn.addEventListener("click", () => {
                    const modal = new bootstrap.Modal(document.getElementById("depositWithdrawModal"));
                    modal.show();
                });
            }

            const user = LocalStorage.getItem("walletUser");
            const userId = LocalStorage.getItem("userID");
            if (user && userId) {
                btn?.classList.remove("d-none");
            }

            // Placeholder akcije
            document.addEventListener("click", e => {
                if (e.target.id === "chooseDeposit") {
                    console.log("Deposit clicked");
                    // Ovdje možeš otvoriti novi modal ili prikazati formu
                } else if (e.target.id === "chooseWithdraw") {
                    console.log("Withdraw clicked");
                }
            });
        });
}
