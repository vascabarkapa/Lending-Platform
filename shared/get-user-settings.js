function getUserSettings() {
    const wsUrl = LocalStorage.getActiveWebSocketUrl();
    const USER_ID = LocalStorage.getItem("userID");
    const NODE_ID = LocalStorage.getItem("nodeID") || 140;

    if (!USER_ID) {
        console.warn("UserID is missing.");
        return;
    }

    if (!wsUrl) {
        console.warn("WebSocket URL is not defined.");
        return;
    }

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        const payload = {
            Type: "GetAccountSettings",
            UserID: USER_ID,
            NodeID: NODE_ID
        };

        socket.send(JSON.stringify(payload));
    };

    socket.onmessage = (event) => {
        try {
            const response = JSON.parse(event.data);
            if (response.Type === "GetAccountSettings" && response.State === "Success") {
                LocalStorage.setItem("AccountSettings", response.Data);
                socket.close();
            }
        } catch (err) {
            console.error("Error processing GetAccountSettings response:", err.message);
            socket.close();
        }
    };

    socket.onerror = (err) => {
        console.error("WebSocket error during GetAccountSettings:", err.message);
    };
}
