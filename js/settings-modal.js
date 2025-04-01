function loadSettingsModal() {
    fetch('./components/shared/settings-modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML('beforeend', html);

            const icon = document.querySelector(".settings-icon");
            if (!icon) return;

            icon.addEventListener("click", () => {
                const modalEl = document.getElementById("settingsModal");
                const modal = new bootstrap.Modal(modalEl);
                modal.show();

                const modalBody = modalEl.querySelector(".modal-body");
                const originalModalContent = modalBody.innerHTML;

                function initializeSettingsModalContent() {
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

                    document.getElementById("connectWsBtn").replaceWith(document.getElementById("connectWsBtn").cloneNode(true));
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

                    document.getElementById("eraseDataBtn").replaceWith(document.getElementById("eraseDataBtn").cloneNode(true));
                    document.getElementById("eraseDataBtn").addEventListener("click", () => {
                        modalBody.innerHTML = `
                            <div class="text-center">
                                <h5 class="mb-5 text-white pb-2">Are you sure you want to erase all data?</h5>
                                <div class="d-flex justify-content-center gap-2 mt-5">
                                    <button type="button" class="btn btn-outline-light w-50" id="cancelEraseBtn">
                                        <i class="bi bi-x-lg me-1"></i> Cancel
                                    </button>
                                    <button type="button" class="btn btn-danger w-50" id="confirmEraseBtn">
                                        <i class="bi bi-trash3 me-1"></i> Delete
                                    </button>
                                </div>
                            </div>
                        `;

                        document.getElementById("cancelEraseBtn").addEventListener("click", () => {
                            modalBody.innerHTML = originalModalContent;
                            initializeSettingsModalContent();
                        });

                        document.getElementById("confirmEraseBtn").addEventListener("click", () => {
                            localStorage.clear();
                            location.reload();
                        });
                    });

                    wsSelect.addEventListener("change", (e) => {
                        if (e.target.value === "") {
                            customGroup.classList.remove("d-none");
                        } else {
                            customGroup.classList.add("d-none");
                        }
                    });
                }

                modalEl.addEventListener("hidden.bs.modal", () => {
                    const modalBody = modalEl.querySelector(".modal-body");
                    modalBody.innerHTML = originalModalContent;
                    initializeSettingsModalContent();
                });

                initializeSettingsModalContent();
            });
        });
}
