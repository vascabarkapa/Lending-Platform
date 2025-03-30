function shortenAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function updateWsStatusIndicator() {
    const el = document.getElementById("wsStatusIndicator");
    if (!el) return;

    const status = localStorage.getItem("wsStatus");

    if (status === "connected") {
        el.classList.remove("bg-danger", "bg-secondary");
        el.classList.add("bg-success");
    } else if (status === "error") {
        el.classList.remove("bg-success", "bg-secondary");
        el.classList.add("bg-danger");
    } else {
        el.classList.remove("bg-success", "bg-danger");
        el.classList.add("bg-secondary");
    }
}
