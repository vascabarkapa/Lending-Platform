function renderDashboardBalances() {
    const rbtc = LocalStorage.getRBTC();
    const usdc = LocalStorage.getUSDC();

    const rbtcBalanceEl = document.getElementById("rbtcBalance");
    const usdcBalanceEl = document.getElementById("usdcBalance");

    if (rbtcBalanceEl) {
        rbtcBalanceEl.innerText = rbtc.AvailableFunds.toFixed(4);
    }

    if (usdcBalanceEl) {
        usdcBalanceEl.innerText = usdc.AvailableFunds.toFixed(4);
    }
}