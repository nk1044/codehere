import { exec } from "child_process";

const MEMORY_LIMIT = "10m";  // Corrected memory limit format
const TIMEOUT = 2000;  // Increased timeout

const CodeRunner = async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    console.log("Executing code:", code);

    const image = "node:18";
    
    // Properly escape double quotes inside the shell command
    const safeCode = code.replace(/(["$`\\])/g, "\\$1");
    const safeCommand = `node -e "${safeCode}"`;

    // Wrap command in single quotes to prevent premature termination
    const dockerCommand = `docker run --rm --network=none -m ${MEMORY_LIMIT} --cpus=".5" --pids-limit 50 -i ${image} sh -c '${safeCommand}'`;

    exec(dockerCommand, { timeout: TIMEOUT }, (error, stdout, stderr) => {
        if (error) {
            return res.json({ output: stderr || error.message || "Execution error" });
        }
        res.json({ output: stdout.trim() });
    });
};

export default CodeRunner;