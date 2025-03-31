async function connectWebSocket() {
    const wsUrl = LocalStorage.getActiveWebSocketUrl();
    const USER_ID = LocalStorage.getItem("userID");
    const NODE_ID = LocalStorage.getItem("nodeID") || 140;

    if (!USER_ID) {
        throw new Error("UserID is missing. Cannot subscribe.");
    }

    return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl);

        ws.onerror = (error) => {
            reject(new Error("WebSocket error: " + error.message));
        };

        ws.onopen = () => {
            ws.send(JSON.stringify({
                Type: "SubscribeBalance",
                UserID: USER_ID,
                NodeID: NODE_ID,
            }));

            resolve(ws);
        };

        ws.onmessage = (event) => {
            try {
                const dataObject = JSON.parse(event.data);
                const {Type, Data} = dataObject;

                switch (Type) {
                    case "SubscribeBalance":
                        LocalStorage.setItem("SubscribeBalance", Data);
                        break;
                    case "OrderAlteration":
                        LocalStorage.setItem("OrderAlteration", Data);
                        break;
                    case "ReturnHeartbeat":
                        LocalStorage.setItem("ReturnHeartbeat", Data);
                        break;
                    default:
                        LocalStorage.setItem(Type, Data);
                        break;
                }

            } catch (err) {
                console.error("Error parsing WS message:", err.message);
            }
        };
    });
}
