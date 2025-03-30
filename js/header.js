function loadHeader() {
    fetch('./components/shared/header.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('header-placeholder').innerHTML = html;

            const currentPath = window.location.pathname.split('/').pop();
            document.querySelectorAll('.nav-links a').forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
            document.querySelectorAll('.offcanvas a').forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('text-primary');
                }
            });

            const connectBtn = document.getElementById("connectWalletBtn");
            const user = localStorage.getItem("walletUser");

            if (user && connectBtn) {
                const parsed = JSON.parse(user);
                connectBtn.innerHTML = `<i class="bi bi-person-check"></i> <span class="d-none d-md-inline ms-1">${shortenAddress(parsed.address)}</span>`;
            }

            if (connectBtn) {
                connectBtn.addEventListener("click", () => {
                    const user = localStorage.getItem("walletUser");
                    const modalId = user ? "walletModal" : "walletSelectModal";
                    const modal = new bootstrap.Modal(document.getElementById(modalId));

                    if (user) {
                        const parsed = JSON.parse(user);
                        document.getElementById("walletAddressDisplay").innerText = shortenAddress(parsed.address);
                    }

                    modal.show();
                });
            }
        });
}
