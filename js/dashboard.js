function renderDashboardBalances() {
    const rbtc = LocalStorage.getRBTC();
    const usdc = LocalStorage.getUSDC();

    const rbtcBalanceEl = document.getElementById("rbtcBalance");
    const usdcBalanceEl = document.getElementById("usdcBalance");

    if (rbtcBalanceEl) {
        rbtcBalanceEl.innerText = (rbtc.AvailableFunds / 1000).toFixed(4);
    }

    if (usdcBalanceEl) {
        usdcBalanceEl.innerText = (usdc.AvailableFunds / 1000).toFixed(4);
    }
}