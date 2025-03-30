function loadSettingsModal() {
    fetch('./components/shared/settings-modal.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML('beforeend', html);

            const icon = document.querySelector(".settings-icon");
            if (icon) {
                icon.addEventListener("click", () => {
                    const modal = new bootstrap.Modal(document.getElementById("settingsModal"));
                    modal.show();

                    const urlSelect = document.getElementById("wsURL");
                    const urlInput = document.getElementById("wsURLc");
                    const userId = document.getElementById("userid");
                    const customGroup = document.getElementById("customUrlGroup");

                    // 📦 Load settings from one object
                    const defaultSettings = {
                        selected: "wss://node928.info:82",
                        custom: "wss://",
                        userId: ""
                    };

                    const settings = JSON.parse(localStorage.getItem("wsSettings")) || defaultSettings;

                    urlSelect.value = settings.selected;
                    urlInput.value = settings.custom;
                    userId.value = settings.userId;

                    if (urlSelect.value === "") {
                        customGroup.classList.remove("d-none");
                        setTimeout(() => {
                            urlInput.setSelectionRange(urlInput.value.length, urlInput.value.length);
                        }, 0);
                    } else {
                        customGroup.classList.add("d-none");
                        urlInput.value = urlSelect.value;
                    }

                    urlSelect.addEventListener("change", () => {
                        if (urlSelect.value === "") {
                            customGroup.classList.remove("d-none");
                            urlInput.value = "wss://";
                            setTimeout(() => {
                                urlInput.setSelectionRange(urlInput.value.length, urlInput.value.length);
                            }, 0);
                        } else {
                            customGroup.classList.add("d-none");
                            urlInput.value = urlSelect.value;
                        }
                    });

                    urlInput.addEventListener("input", () => {
                        if (!urlInput.value.startsWith("wss://")) {
                            urlInput.value = "wss://";
                        }
                    });

                    urlInput.addEventListener("keydown", (e) => {
                        const prefix = "wss://";
                        const pos = urlInput.selectionStart;
                        if ((e.key === "Backspace" || e.key === "ArrowLeft") && pos <= prefix.length) {
                            e.preventDefault();
                            urlInput.setSelectionRange(prefix.length, prefix.length);
                        }
                    });

                    const connectBtn = document.getElementById("connectWsBtn");
                    connectBtn.replaceWith(connectBtn.cloneNode(true));
                    document.getElementById("connectWsBtn").addEventListener("click", () => {
                        const finalUrl = urlInput.value.trim();
                        const finalUser = userId.value.trim();

                        if (!finalUser) {
                            alert("Please enter a valid User ID.");
                            userId.focus();
                            return;
                        }

                        // Save all in one object
                        const updatedSettings = {
                            selected: urlSelect.value,
                            custom: finalUrl,
                            userId: finalUser
                        };
                        localStorage.setItem("wsSettings", JSON.stringify(updatedSettings));

                        // WebSocket connection
                        const NODE_ID = 104;
                        const wsUrl = (urlSelect.value === "") ? urlInput.value : urlSelect.value;

                        try {
                            const ws = new WebSocket(wsUrl);

                            ws.onerror = (error) => {
                                console.error("WebSocket error:", error);
                                localStorage.setItem("wsStatus", "error");
                                localStorage.setItem("wsLastError", error.message || "Unknown error");
                            };

                            ws.onopen = () => {
                                console.log("Connected to WebSocket");
                                localStorage.setItem("wsStatus", "connected");
                                localStorage.setItem("wsConnectedURL", wsUrl);
                                localStorage.setItem("wsConnectedUserId", finalUser);

                                const payload = {
                                    Type: "SubscribeBalance",
                                    UserID: finalUser,
                                    NodeID: NODE_ID,
                                };

                                ws.send(JSON.stringify(payload));
                            };

                            ws.onmessage = (event) => {
                                try {
                                    const dataObject = JSON.parse(event.data);
                                    localStorage.setItem("wsLastMessage", JSON.stringify(dataObject));
                                } catch (error) {
                                    console.error("Error processing message:", error);
                                }
                            };

                        } catch (err) {
                            console.error("WebSocket failed to connect:", err);
                            localStorage.setItem("wsStatus", "error");
                            localStorage.setItem("wsLastError", err.message || "Unknown connection failure");
                        }

                        modal.hide();
                    });
                });
            }
        });
}
