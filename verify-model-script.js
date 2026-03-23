const { spawn } = require('child_process');
const path = require('path');

function runPrediction() {
    // Mock data: 30 days of prices and volumes
    const prices = Array.from({ length: 30 }, (_, i) => 100 + i + Math.random() * 5);
    const volumes = Array.from({ length: 30 }, () => 10000 + Math.random() * 5000);

    const inputData = JSON.stringify({ prices, volumes });
    const scriptPath = path.join(__dirname, 'predict_stock.py');
    console.log(`Executing python script at: ${scriptPath}`);

    const pythonProcess = spawn('python', ['predict_stock.py'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
        const str = data.toString();
        console.log(`[STDOUT]: ${str}`);
        result += str;
    });

    pythonProcess.stderr.on('data', (data) => {
        const str = data.toString();
        console.error(`[STDERR]: ${str}`);
        error += str;
    });

    pythonProcess.on('error', (err) => {
        console.error('Failed to start subprocess.', err);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);

        if (code !== 0) {
            console.error('Final Stderr:', error);
            return;
        }

        try {
            const parsed = JSON.parse(result);
            console.log('✅ Prediction Success:', parsed);
        } catch (e) {
            console.error('Failed to parse output:', e);
            console.log('Raw Result:', result);
        }
    });

    // Write input to stdin
    try {
        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();
        console.log("Input written to stdin");
    } catch (e) {
        console.error("Error writing to stdin:", e);
    }
}

runPrediction();
