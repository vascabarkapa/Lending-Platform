function loadFooter() {
    fetch('./components/shared/footer.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('footer-placeholder').innerHTML = html;

            const defaultSettings = {
                selected: "wss://node928.info:82",
                custom: "wss://",
                connected: false
            };

            const existingSettings = LocalStorage.getItem("wsSettings");
            if (!existingSettings) {
                LocalStorage.setItem("wsSettings", defaultSettings);
            }
        });
}
