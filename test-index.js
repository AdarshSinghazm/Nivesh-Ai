const yahooFinance = require('yahoo-finance2').default;

async function testIndex() {
    console.log("Testing fetch for ^NSEI...");
    try {
        // In some versions, the default export is the instance, 
        // in others it's a class. Let's try to detect.
        let instance = yahooFinance;
        if (typeof yahooFinance === 'function') {
            instance = new yahooFinance();
        }

        const quote = await instance.quote('^NSEI');
        console.log("✅ Successfully fetched ^NSEI:");
        console.log(`   Price: ${quote.regularMarketPrice}`);
        console.log(`   Change: ${quote.regularMarketChange}`);
    } catch (e) {
        console.error("❌ Failed to fetch ^NSEI:", e.message);
        if (e.errors) console.error("Validation errors:", e.errors);
    }
}

testIndex();
