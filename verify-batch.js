const { getAllEnhancedStocks } = require('./lib/services/enhancedStockService');

async function testBatchFetch() {
    console.log("Testing getAllEnhancedStocks (Batch Fetch)...");
    try {
        const stocks = await getAllEnhancedStocks();
        console.log(`✅ Fetched ${stocks.length} stocks using batch mode.`);

        stocks.forEach(s => {
            console.log(`${s.symbol.padEnd(12)} | ₹${s.price.toFixed(2).padStart(8)} | ${s.changePercent > 0 ? '+' : ''}${s.changePercent.toFixed(2)}%`);
            if (s.price === 0) {
                console.warn(`⚠️ WARNING: ${s.symbol} has 0.00 price!`);
            }
        });

    } catch (e) {
        console.error("❌ Batch Fetch Failed:", e);
    }
}

testBatchFetch();
