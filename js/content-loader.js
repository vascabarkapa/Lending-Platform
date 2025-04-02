function loadMainContent() {
    const user = localStorage.getItem("walletUser");
    const homePage = user
        ? './components/home/dashboard.html'
        : './components/home/content.html';

    fetch(homePage)
        .then(res => res.text())
        .then(html => {
            document.getElementById('page-content').innerHTML = html;

            if (user) {
                renderDashboardBalances();
            }
        });
}
