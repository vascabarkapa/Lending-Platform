function loadDepositWithdrawModal() {
    fetch('./components/shared/deposit-withdraw-modal.html')
        .then(res => res.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);

            const depositBtn = document.getElementById("openDepositModalBtn");
            if (depositBtn) {
                depositBtn.addEventListener("click", () => {
                    const modal = new bootstrap.Modal(document.getElementById("depositModal"));
                    modal.show();
                });
            }

            const user = LocalStorage.getItem("walletUser");
            const userId = LocalStorage.getItem("userID");
            if (user && userId) {
                depositBtn?.classList.remove("d-none");
            }
        });
}
