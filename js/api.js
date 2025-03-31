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
                    response.Nonce === nonce &&
                    response.State === "Success"
                ) {
                    resolve(response.Data);
                    socket.close();
                }

                console.log(response)
            };

            socket.onerror = (err) => {
                reject(err);
            };
        } catch (err) {
            reject(err);
        }
    });
}
