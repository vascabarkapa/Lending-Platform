async function getLendingInfo() {
    const wsUrl = LocalStorage.getActiveWebSocketUrl();
    const USER_ID = LocalStorage.getItem("userID");
    const NODE_ID = LocalStorage.getItem("nodeID") || 140;

    if (!USER_ID) {
        throw new Error("UserID is missing.");
    }

    const transferData = {
        CreatedByUser: unixToTicks(Date.now()),
        MinerFeeStr: "0.00001",
        NodeID: NODE_ID,
        MarketID: "3e24fe0d-6e3f-49eb-b2c9-1e90be0abf78",
        UserID: USER_ID,
    };

    const message = {
        Type: "GetLendingInfo",
        Data: transferData
    };

    return new Promise((resolve, reject) => {
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            socket.send(JSON.stringify(message));
        };

        socket.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                if (response.Type === "GetLendingInfo" && response.State === "Success") {
                    socket.close();
                    resolve(response.Data);
                }
            } catch (err) {
                socket.close();
                reject(new Error("Invalid response format"));
            }
        };

        socket.onerror = (err) => {
            socket.close();
            reject(new Error("WebSocket error: " + err.message));
        };
    });
}
