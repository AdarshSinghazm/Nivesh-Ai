// Simple test for Yahoo Finance 2
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function testYahooFinance() {
    console.log("Testing Yahoo Finance API Connection...");
    try {
        const quote = await yahooFinance.quote('RELIANCE.NS');
        console.log("✅ Successfully fetched RELIANCE.NS:");
        console.log(`   Price: ₹${quote.regularMarketPrice}`);
        console.log(`   PE: ${quote.trailingPE}`);
        console.log(`   Market Cap: ${(quote.marketCap / 10000000).toFixed(2)} Cr`);

        const quote2 = await yahooFinance.quote('TCS.NS');
        console.log("✅ Successfully fetched TCS.NS:");
        console.log(`   Price: ₹${quote2.regularMarketPrice}`);
    } catch (e) {
        console.error("❌ Failed to fetch from Yahoo Finance:", e.message);
        console.error(e);
    }
}

testYahooFinance();
