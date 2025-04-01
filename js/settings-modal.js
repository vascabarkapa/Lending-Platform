function loadSettingsModal() {
    fetch('./components/shared/settings-modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML('beforeend', html);

            const icon = document.querySelector(".settings-icon");
            if (!icon) return;

            icon.addEventListener("click", () => {
                const modal = new bootstrap.Modal(document.getElementById("settingsModal"));
                modal.show();

                const settings = LocalStorage.getItem("wsSettings") || {
                    selected: "wss://node928.info:82",
                    custom: "wss://"
                };

                const wsSelect = document.getElementById("wsURL");
                const customInput = document.getElementById("wsURLc");
                const customGroup = document.getElementById("customUrlGroup");

                wsSelect.value = settings.selected;
                customInput.value = settings.custom;

                if (settings.selected === "") {
                    customGroup.classList.remove("d-none");
                }

                const connectBtn = document.getElementById("connectWsBtn");
                connectBtn.replaceWith(connectBtn.cloneNode(true));
                document.getElementById("connectWsBtn").addEventListener("click", async () => {
                    const selectedUrl = wsSelect.value;
                    const customUrl = customInput.value;

                    const updatedSettings = {
                        selected: selectedUrl,
                        custom: customUrl
                    };

                    LocalStorage.setItem("wsSettings", updatedSettings);

                    try {
                        await connectWebSocket();
                        modal.hide();
                    } catch (err) {
                        alert("WebSocket connection failed: " + err.message);
                    }
                });

                const eraseBtn = document.getElementById("eraseDataBtn");
                eraseBtn.replaceWith(eraseBtn.cloneNode(true));
                document.getElementById("eraseDataBtn").addEventListener("click", () => {
                    if (confirm("Are you sure you want to erase all data?")) {
                        localStorage.clear();
                        location.reload();
                    }
                });

                wsSelect.addEventListener("change", (e) => {
                    if (e.target.value === "") {
                        customGroup.classList.remove("d-none");
                    } else {
                        customGroup.classList.add("d-none");
                    }
                });
            });
        });
}
