function shortenAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function updateWsStatusIndicator() {
    const el = document.getElementById("wsStatusIndicator");
    if (!el) return;

    const status = LocalStorage.getItem("wsSettings").connected;

    if (status === true) {
        el.classList.remove("bg-danger", "bg-secondary");
        el.classList.add("bg-success");
    } else if (status === false) {
        el.classList.remove("bg-success", "bg-secondary");
        el.classList.add("bg-danger");
    } else {
        el.classList.remove("bg-success", "bg-danger");
        el.classList.add("bg-secondary");
    }
}

function updateCurrentNodeDisplay() {
    const wsSettings = LocalStorage.getItem("wsSettings");
    if (!wsSettings) return;

    const selectedUrl = wsSettings.selected;
    const currentNode = WebSocketServers.find(server => server.value === selectedUrl);

    const nodeDisplay = document.getElementById("currentNodeDisplay");
    if (nodeDisplay && currentNode) {
        nodeDisplay.innerText = `Node: ${currentNode.label}`;
    }
}
