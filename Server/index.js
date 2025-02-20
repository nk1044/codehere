import app from "./app.js";
import 'dotenv/config';
import { connectDB } from "./src/config/db/db.js";

const PORT = process.env.PORT || 9000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
).catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
}
);