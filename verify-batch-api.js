// using global fetch available in Node 18+

async function testBatchAPI() {
    const symbols = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS'];
    const url = `http://localhost:3000/api/market/quote?symbols=${symbols.join(',')}`;

    console.log(`Fetching: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            return;
        }

        const data = await response.json();
        console.log("✅ Batch API Response:", JSON.stringify(data, null, 2));

        if (data.quotes && data.quotes.length > 0) {
            console.log("\nParsed Prices:");
            data.quotes.forEach(q => {
                console.log(`${q.symbol}: ${q.regularMarketPrice}`);
            });
        } else {
            console.warn("⚠️ No quotes returned!");
        }

    } catch (e) {
        console.error("❌ Request Failed:", e.message);
    }
}

testBatchAPI();
