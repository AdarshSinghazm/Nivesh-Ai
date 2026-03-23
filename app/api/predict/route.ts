import { type NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { prices, volumes, symbol } = body;

        // Input validation
        if (!symbol && (!prices || !volumes || prices.length === 0 || volumes.length === 0)) {
            return NextResponse.json(
                { error: 'Missing required input: needs "symbol" OR "prices" and "volumes"' },
                { status: 400 }
            );
        }

        // Path to python script
        const scriptPath = path.join(process.cwd(), 'predict_stock.py');

        const predictionResult = await new Promise<{ error?: string; details?: string; status?: number; result?: string; confidence?: number }>((resolve) => {
            const pythonProcess = spawn('python', [scriptPath]);

            let result = '';
            let error = '';

            pythonProcess.stdout.on('data', (data) => {
                result += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python script error:', error);
                    resolve({ error: 'Model inference failed', details: error, status: 500 });
                    return;
                }

                try {
                    const parsed = JSON.parse(result);
                    if (parsed.error) {
                        resolve({ error: parsed.error, status: 400 });
                    } else {
                        resolve(parsed);
                    }
                } catch (e) {
                    resolve({ error: 'Failed to parse model output', status: 500 });
                }
            });

            // Write input to script
            pythonProcess.stdin.write(JSON.stringify({ prices, volumes }));
            pythonProcess.stdin.end();
        });

        if (predictionResult.error) {
            return NextResponse.json({ error: predictionResult.error, details: predictionResult.details }, { status: predictionResult.status || 400 });
        }

        return NextResponse.json(predictionResult);

    } catch (error) {
        console.error('Prediction API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
