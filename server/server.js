import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
//import 'dotenv/config';
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import devRouter from "./routes/devRoute.js";



const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

// Test route
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)

// Dev-only routes (only mounted when not in production)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRouter);
}



// Start server after DB connection
const startServer = async () => {
  await connectDB(); // wait for DB
  await connectCloudinary();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });  
}; 

startServer();
