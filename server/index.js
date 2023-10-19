import express from "express";
import https from "http";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import channelsRoutes from "./src/routes/channelsRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import connectToMongoDB from "./db.js";
import { registerSocketServer } from "./src/io/io.js";
import Channel from "./src/models/Channel.js";
import Message from "./src/models/Message.js";
import User from "./src/models/User.js";


dotenv.config();

const port = process.env.PORT || 5003;

const app = express();

app.use(express.json());

app.use(cors());

connectToMongoDB();

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelsRoutes);
app.use("/api/settings", settingsRoutes);

const server = https.createServer(app);

registerSocketServer(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
