function initPlaceOrderForm() {
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (!placeOrderBtn) return;

    let ws;

    placeOrderBtn.addEventListener("click", async () => {
        placeOrderBtn.disabled = true;
        console.log("Placing order...");

        if (!ws || ws.readyState !== WebSocket.OPEN) {
            const wsUrl = LocalStorage.getActiveWebSocketUrl();
            if (!wsUrl) {
                showToast("Missing WebSocket URL. Configure it in Settings.", ToastType.ERROR);
                placeOrderBtn.disabled = false;
                return;
            }

            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("✅ WebSocket connection opened for placing order.");
                sendOrder();
            };

            ws.onerror = (err) => {
                console.error("❌ WebSocket error:", err);
                showToast("WebSocket error while placing order.", ToastType.ERROR);
                placeOrderBtn.disabled = false;
            };

            ws.onclose = () => {
                console.warn("ℹ️ WebSocket connection closed.");
            };
        } else {
            sendOrder();
        }

        async function sendOrder() {
            const makerOrderId = generateUniqueOrderId();
            const marketID = "766c97ab-4c30-4ffd-addb-a7a6853e9a5c";

            const amount = parseFloat(document.getElementById("amount")?.value || 0);
            const price = parseFloat(document.getElementById("price")?.value || 0);

            if (!amount || amount <= 0 || !price || price <= 0) {
                showToast("Please enter valid price and amount", ToastType.ERROR);
                placeOrderBtn.disabled = false;
                return;
            }

            const side = parseInt(document.querySelector("input[name='side']:checked")?.value || "0");
            const ordertype = parseInt(document.querySelector("input[name='type']:checked")?.value || "0");

            const userID = parseInt(LocalStorage.getItem("userID"));

            if (isNaN(userID)) {
                console.error("❌ Missing private key or userID in LocalStorage.");
                placeOrderBtn.disabled = false;
                return;
            }

            try {
                const orderData = {
                    CreatedByUser: unixToTicks(Date.now()),
                    MinerFeeStr: "0.00001",
                    NodeID: 1,
                    UnmatchedOrder: {
                        Amount: amount,
                        ID: makerOrderId,
                        makerCT: 2000,
                        Price: price,
                        RemAmount: amount,
                        Side: side,
                        Type: ordertype,
                    },
                    UserID: userID,
                    UserOrder: {
                        MarketID: marketID,
                    },
                };

                if (orderData.UnmatchedOrder.Type === 0) {
                    delete orderData.UnmatchedOrder.Type;
                }
                if (orderData.UnmatchedOrder.Side === 0) {
                    delete orderData.UnmatchedOrder.Side;
                }

                const wallet = ethers.Wallet.createRandom();
                const signature = await wallet.signMessage(JSON.stringify(orderData));

                const message = {
                    Type: "OrderAlteration",
                    SignatureUser: hexToBase64(signature.slice(2)),
                    Data: orderData,
                };

                ws.send(JSON.stringify(message));

                console.log("📤 Order sent to WebSocket.");
                showToast("Order sent successfully!", ToastType.SUCCESS);
                loadPlaceOrderModal(orderData);
            } catch (error) {
                console.error(`❌ Error placing order: ${error.message}`);
                showToast("Error placing order", ToastType.ERROR);
            } finally {
                placeOrderBtn.disabled = false;
            }
        }
    });
}
