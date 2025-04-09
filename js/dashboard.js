function renderDashboardBalances() {
    const rbtc = LocalStorage.getRBTC();
    const usdc = LocalStorage.getUSDC();

    const rbtcBalanceEl = document.getElementById("rbtcBalance");
    const usdcBalanceEl = document.getElementById("usdcBalance");
    const balanceEl = document.getElementById("walletBalanceDisplayHeader");

    if (rbtcBalanceEl) {
        rbtcBalanceEl.innerText = (rbtc.AvailableFunds / 1000).toFixed(4);
    }

    if (usdcBalanceEl) {
        usdcBalanceEl.innerText = (usdc.AvailableFunds / 1000).toFixed(4);
    }

    if (rbtcBalanceEl) {
        balanceEl.innerText = rbtc.AvailableFunds.toFixed(2) + " mRBTC";
    }
}