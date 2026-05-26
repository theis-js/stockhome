import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// frontend routes
import userRouter from "./routes/app/users.route.js";
app.use("/users", userRouter);

import productRouter from "./routes/app/products.route.js";
app.use("/products", productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// error handling code
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
