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

    const assetBorrowAvailableInfo = document.getElementById("assetBorrowAvailableInfo");
    const assetBorrowAvailableInfoMobile = document.getElementById("assetBorrowAvailableInfoMobile");
    const assetBorrowAPYInfo = document.getElementById("assetBorrowAPYInfo");
    const assetBorrowAPYInfoMobile = document.getElementById("assetBorrowAPYInfoMobile");

    new bootstrap.Tooltip(assetBorrowAvailableInfo);
    new bootstrap.Tooltip(assetBorrowAvailableInfoMobile);
    new bootstrap.Tooltip(assetBorrowAPYInfo);
    new bootstrap.Tooltip(assetBorrowAPYInfoMobile);
}

function toggleSection(sectionName) {
    const content = document.getElementById(`${sectionName}Content`);
    const label = document.getElementById(`${sectionName}ToggleLabel`);
    const icon = document.getElementById(`${sectionName}ToggleIcon`);

    if (!content || !label || !icon) return;

    const isHidden = content.style.display === 'none';

    content.style.display = isHidden ? 'block' : 'none';
    label.innerText = isHidden ? 'Hide' : 'Show';
    icon.innerText = isHidden ? '–' : '+';
}