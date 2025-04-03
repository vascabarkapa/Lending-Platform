function loadPlaceOrderModal(orderData) {
    fetch('./components/shared/place-order-summary.html')
        .then(res => res.text())
        .then(html => {
            const modalContainer = document.getElementById('modal-placeholder');
            if (!document.getElementById('placeOrderModal')) {
                modalContainer.insertAdjacentHTML("beforeend", html);
            }

            // Čekamo malo dok se ubaci u DOM
            setTimeout(() => {
                const modalEl = document.getElementById('placeOrderModal');
                const summaryEl = document.getElementById('placeOrderSummary');

                if (!modalEl || !summaryEl) return;

                const {
                    CreatedByUser, MinerFeeStr, NodeID, UserID,
                    UnmatchedOrder: { Amount, ID, Price, RemAmount, makerCT },
                    UserOrder: { MarketID }
                } = orderData;

                summaryEl.innerHTML = `
                    <ul class="list-unstyled mb-0">
                        <li><strong>Market ID:</strong> ${MarketID}</li>
                        <li><strong>User ID:</strong> ${UserID}</li>
                        <li><strong>Order ID:</strong> ${ID}</li>
                        <li><strong>Amount:</strong> ${Amount}</li>
                        <li><strong>Remaining Amount:</strong> ${RemAmount}</li>
                        <li><strong>Price:</strong> ${Price}</li>
                        <li><strong>Miner Fee:</strong> ${MinerFeeStr}</li>
                        <li><strong>Created:</strong> ${new Date(ticksToUnix(CreatedByUser)).toLocaleString()}</li>
                        <li><strong>Maker CT:</strong> ${makerCT}</li>
                        <li><strong>Node ID:</strong> ${NodeID}</li>
                    </ul>
                `;

                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }, 100);
        });
}