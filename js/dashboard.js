function renderDashboardBalances(repeat = 0) {
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

    if (balanceEl && rbtc) {
        balanceEl.innerText = rbtc.AvailableFunds.toFixed(2) + " mRBTC";
    }

    if (repeat < 2) {
        setTimeout(() => renderDashboardBalances(repeat + 1), 500);
    }
}
