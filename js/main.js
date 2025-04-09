const scripts = [
    './js/utils.js',
    './js/header.js',
    './js/footer.js',
    './js/content-loader.js',
    './js/wallet-modal.js',
    './js/wallet-connect.js',
    './js/wallet-select-modal.js',
    './js/settings-modal.js',
    './js/api.js',
    './shared/local-storage.js',
    './shared/connect-websocket.js',
    './shared/globals.js',
    './shared/get-user-settings.js',
    './shared/get-lending-info.js',
    './js/dashboard-lending-info.js',
    './shared/toast.js',
    './js/dashboard.js',
    './js/advanced-connect-modal.js',
    './shared/place-order.js',
    './js/place-order-summary.js',
    './js/deposit-withdraw-modal.js',
];

function loadScriptsSequentially(files, callback) {
    if (!files.length) return callback?.();
    const script = document.createElement('script');
    script.src = files.shift();
    script.onload = () => loadScriptsSequentially(files, callback);
    document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
    loadScriptsSequentially([...scripts], () => {
        if (typeof loadHeader === 'function') loadHeader();
        if (typeof loadFooter === 'function') loadFooter();
        if (typeof loadMainContent === 'function') loadMainContent();
        if (typeof loadWalletInfoModal === 'function') loadWalletInfoModal();
        if (typeof loadWalletSelectModal === 'function') loadWalletSelectModal();
        if (typeof loadSettingsModal === 'function') loadSettingsModal();
        if (typeof loadDepositWithdrawModal === 'function') loadDepositWithdrawModal();
    });
});
