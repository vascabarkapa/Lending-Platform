function initPlaceOrderForm() {
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (!placeOrderBtn) return;

    placeOrderBtn.addEventListener("click", async () => {
        placeOrderBtn.disabled = true;
        console.log("Placing order...");

        const makerOrderId = generateUniqueOrderId();
        const marketID = "766c97ab-4c30-4ffd-addb-a7a6853e9a5c";

        const amount = parseFloat(document.getElementById("amount")?.value || 0);
        const price = parseFloat(document.getElementById("price")?.value || 0);

        // ✅ Validacija: amount i price moraju biti veći od 0
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

            console.log("✅ Message signed successfully!");
            console.log(orderData);

            const message = {
                Type: "OrderAlteration",
                SignatureUser: hexToBase64(signature.slice(2)),
                Data: orderData,
            };

            ws.send(JSON.stringify(message));
            console.log("📤 Order sent to WebSocket.");
        } catch (error) {
            console.error(`❌ Error placing order: ${error.message}`);
        } finally {
            placeOrderBtn.disabled = false;
        }
    });
}