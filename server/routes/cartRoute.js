import express from "express"; // ✅ You need this!

import mongoose from "mongoose";
import { updateCart } from "../controllers/cartController.js";
import authUser from "../middlewares/authUser.js";


const cartRouter = express.Router();
cartRouter.post('/update',authUser,updateCart)

export default cartRouter;