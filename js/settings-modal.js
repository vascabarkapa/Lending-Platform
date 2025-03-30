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

                    // ⬇️ Defaultna vrijednost (Asia) ako ništa nije snimljeno
                    const savedUrl = localStorage.getItem("wsURL") ?? "wss://node928.info:82";
                    const savedCustom = localStorage.getItem("wsURLc") ?? "wss://";
                    const savedUser = localStorage.getItem("wsUserId") ?? "";

                    urlSelect.value = savedUrl;
                    urlInput.value = savedCustom;
                    userId.value = savedUser;

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

                    // ✅ Validacija i čuvanje
                    document.getElementById("connectWsBtn").addEventListener("click", () => {
                        const finalUrl = urlInput.value.trim();
                        const finalUser = userId.value.trim();

                        if (!finalUser) {
                            alert("Please enter a valid User ID.");
                            userId.focus();
                            return;
                        }

                        localStorage.setItem("wsURL", urlSelect.value);
                        localStorage.setItem("wsURLc", finalUrl);
                        localStorage.setItem("wsUserId", finalUser);

                        console.log("WebSocket settings saved:", {finalUrl, finalUser});
                        modal.hide();
                    });
                });
            }
        });
}
