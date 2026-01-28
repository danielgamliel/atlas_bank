
import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB, getDB } from "../db/mongodb.js";
import { initDB } from "../db/init.js";

const PORT = Number(process.env.PORT || 3000);
let uri = process.env.MONGODB_URI;
await connectDB(uri); console.log("MongoDB connected");


console.log("URI:",uri.replace(/:(.*?)@/, ":****@"));
console.log("Connected DB:", getDB().databaseName);

await initDB(); //creating index of uniqe mail


const app = createApp();

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
