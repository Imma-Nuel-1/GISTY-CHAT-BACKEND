import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import "./config/dbconfig";
import userRoutes from "./routes/usersRoutes"; // Import user routes

dotenv.config(); // Load environment variables from the .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors()); // Alternatively, restrict to your frontend's origin:
// app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

// Use user routes
app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Gisty Chat Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
