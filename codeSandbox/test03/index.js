import express from 'express';
import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';

const app = express();
const docker = new Docker();
const Path = path.resolve('./', 'CodeFiles');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('server is running healthy');
});

const RunCode = async (req, res) => {
    const filePath = path.resolve(Path, 'test.js');

    if (!fs.existsSync(filePath)) {
        return res.status(400).send("Error: test.js does not exist");
    }

    let output = '';
    let execTime = 'N/A';
    let memoryUsed = 'N/A';

    try {
        const container = await docker.createContainer({
            Image: "node:18",
            Cmd: ["sh", "-c", "node /input/test.js"],
            AttachStdout: true,
            AttachStderr: true,
            HostConfig: {
                Binds: [`${Path}:/input:ro`], // Mount Path as /input (read-only)
                AutoRemove: true,
                Memory: 512 * 1024 * 1024, // 512MB RAM limit
                CpuShares: 512, // Limit CPU usage
                NetworkMode: "none" // Disable network access
            }
        });

        await container.start();
        const stream = await container.logs({ stdout: true, stderr: true, follow: true });

        stream.on("data", (chunk) => {
            const chunkStr = chunk.toString();
            output += chunkStr;

            // Extract Execution Time & Memory from test.js output
            const timeMatch = chunkStr.match(/Execution Time: ([\d.]+) seconds/);
            const memoryMatch = chunkStr.match(/Memory Used: ([\d.]+) MB/);

            if (timeMatch) execTime = timeMatch[1] + ' seconds';
            if (memoryMatch) memoryUsed = memoryMatch[1] + ' MB';
        });

        await container.wait();
    } catch (error) {
        output = `Error: ${error.message}`;
    }

    console.log(`Execution Time: ${execTime}, Memory Used: ${memoryUsed}\nOutput:\n${output}`);

    res.json({
        executionTime: execTime,
        memoryUsed: memoryUsed,
        output: output.trim(),
    });
};

app.get('/run', RunCode);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
