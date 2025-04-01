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
                    selected: WebSocketServer.ASIA.value,
                    custom: "wss://",
                    connected: false
                };

                const wsSelect = document.getElementById("wsURL");
                const customInput = document.getElementById("wsURLc");
                const customGroup = document.getElementById("customUrlGroup");

                wsSelect.innerHTML = "";
                WebSocketServers.forEach(server => {
                    const option = document.createElement("option");
                    option.value = server.value;
                    option.textContent = server.label;
                    wsSelect.appendChild(option);
                });

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
                        custom: customUrl,
                        connected: false
                    };

                    LocalStorage.setItem("wsSettings", updatedSettings);

                    try {
                        await connectWebSocket();
                        modal.hide();
                    } catch (err) {
                        showToast("WebSocket connection failed: " + err.message, ToastType.ERROR);
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
