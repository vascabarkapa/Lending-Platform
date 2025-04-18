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

function toggleAssetsBorrow() {
    const content = document.getElementById('assetsBorrowContent');
    const label = document.getElementById('assetsBorrowToggleLabel');
    const icon = document.getElementById('assetsBorrowToggleIcon');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        label.innerText = 'Hide';
        icon.innerText = '–';
    } else {
        content.style.display = 'none';
        label.innerText = 'Show';
        icon.innerText = '+';
    }
}

function toggleAssetsSupply() {
    const content = document.getElementById('assetsSupplyContent');
    const label = document.getElementById('assetsSupplyToggleLabel');
    const icon = document.getElementById('assetsSupplyToggleIcon');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        label.innerText = 'Hide';
        icon.innerText = '–';
    } else {
        content.style.display = 'none';
        label.innerText = 'Show';
        icon.innerText = '+';
    }
}