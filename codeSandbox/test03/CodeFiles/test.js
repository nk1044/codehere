function measurePerformance(fn) {
    const start = process.hrtime(); // Start time
    const initialMemory = process.memoryUsage().rss / 1024 / 1024; // Initial memory in MB

    Promise.resolve(fn()) // Ensure the function is handled as a promise
        .finally(() => {
            setImmediate(() => { // Wait for all pending operations
                const end = process.hrtime(start); // End time
                const finalMemory = process.memoryUsage().rss / 1024 / 1024; // Final memory after execution

                console.log(`Execution Time: ${(end[0] + end[1] / 1e9).toFixed(6)} seconds`);
                console.log(`Memory Used: ${(finalMemory - initialMemory).toFixed(3)} MB`);
            });
        });
}

measurePerformance(async () => {
    await new Promise((resolve) => {
        setTimeout(() => {
            console.log("Async operation completed.");
            resolve();
        }, 5000);
    });
});
