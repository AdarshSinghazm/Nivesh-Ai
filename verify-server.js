// Using global fetch available in Node 18+

async function checkServer() {
    try {
        console.log('Checking http://localhost:3000...');
        const res = await fetch('http://localhost:3000');
        console.log(`Home Page Status: ${res.status}`);

        console.log('Checking http://localhost:3000/api/market/quote?symbol=RELIANCE.NS...');
        const apiRes = await fetch('http://localhost:3000/api/market/quote?symbol=RELIANCE.NS');
        console.log(`API Status: ${apiRes.status}`);
        if (apiRes.status === 200) {
            const data = await apiRes.json();
            console.log('API Data Sample:', JSON.stringify(data).substring(0, 100) + '...');
        }
    } catch (e) {
        console.error('Server check failed:', e.message);
    }
}

// Check if fetch is available globally (Node 18+), else might need import
if (!globalThis.fetch) {
    console.error("fetch not available, trying to require it or failing.");
}

checkServer();
