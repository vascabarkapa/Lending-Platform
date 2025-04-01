async function renderLendingInfo() {
    try {
        const data = await getLendingInfo();
        const {Settings, Interest, CompoundInterestFactor, LastPriceChange} = data;

        const lastChange = ticksToDate(LastPriceChange);

        const html = `
            <div class="text-secondary mb-3 small">${lastChange}</div>
            <div class="d-flex justify-content-between py-1">
                <span>Commission</span><span>${Settings.Commission * 100}%</span>
            </div>
            <div class="d-flex justify-content-between py-1">
                <span>Max Market Maker Position</span><span>${Settings.Maximum_mm_position}</span>
            </div>
            <div class="d-flex justify-content-between py-1 mt-3">
                <span>Price</span><span>${Settings.Price} USDT</span>
            </div>
            <div class="d-flex justify-content-between py-1">
                <span>mBTC Collateral</span><span>${Settings.mBTC_Collateral}</span>
            </div>
            <div class="d-flex justify-content-between py-1">
                <span>Interest (Rate Limits)</span><span>${Interest * 100}% (${Settings.InterestRateLimits[0] * 100}% - ${Settings.InterestRateLimits[1] * 100}%)</span>
            </div>
            <div class="d-flex justify-content-between py-1">
                <span>Compound Factor</span><span>${CompoundInterestFactor}</span>
            </div>
        `;

        document.getElementById("lendingInfoContent").innerHTML = html;
    } catch (err) {
        document.getElementById("lendingInfoContent").innerHTML = `<span class='text-white mt-3'>Information are not available right now! Try again later.</span>`;
    }
}

renderLendingInfo();
setInterval(renderLendingInfo, 5000);
