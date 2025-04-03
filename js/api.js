async function getUserIDFromPublicKey(publicKey) {
    const nonce = Date.now();
    const requestPayload = {
        Type: "GetUserIDFromPubKey",
        Nonce: nonce,
        Data: {
            PublicKey: publicKey
        }
    };

    return new Promise((resolve, reject) => {
        try {
            const wsUrl = LocalStorage.getActiveWebSocketUrl();
            const socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                socket.send(JSON.stringify(requestPayload));
            };

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                if (
                    response.Type === "GetUserIDFromPubKey" &&
                    response.Nonce === nonce
                ) {
                    if (response.State === "Success") {
                        const userID = parseInt(response.Data);
                        if (!isNaN(userID)) {
                            socket.close();
                            resolve(userID);
                        } else {
                            socket.close();
                            reject("Invalid userID received.");
                        }
                    } else if (response.State === "Error") {
                        socket.close();
                        reject(response.Error || "User not found.");
                    }
                }
            };

            socket.onerror = (err) => {
                reject("WebSocket error: " + err.message);
            };

        } catch (err) {
            reject("WebSocket exception: " + err.message);
        }
    });
}
