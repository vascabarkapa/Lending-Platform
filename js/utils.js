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
    const nodeDisplayCanvas = document.getElementById("currentNodeDisplayCanvas");

    if (nodeDisplay && currentNode) {
        nodeDisplay.innerText = `Node: ${currentNode.label}`;
    }

    if (nodeDisplayCanvas && currentNode) {
        nodeDisplayCanvas.innerText = `Node: ${currentNode.label}`;
    }
}

function unixToTicks(unix) {
    return unix * 10000 + 621355968000000000;
}

function ticksToUnix(ticks) {
    return (ticks - 621355968000000000) / 10000;
}

function hexToBase64(hexString) {
    return btoa(
        hexString
            .match(/.{1,2}/g)
            .map((byte) => String.fromCharCode(parseInt(byte, 16)))
            .join("")
    );
}

function ticksToDate(ticks) {
    const epochTicks = 621355968000000000;
    const ticksPerMillisecond = 10000;
    const msSinceUnixEpoch = (ticks - epochTicks) / ticksPerMillisecond;
    const date = new Date(msSinceUnixEpoch);

    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

function formatAmount(val) {
    const defaultVal = 0
    const num = parseFloat(val);
    return isNaN(num) ? defaultVal.toFixed(4) : num.toFixed(4);
}

function generateUniqueOrderId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generateCSRFToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const length = 128;
    let token = 'CfD';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}