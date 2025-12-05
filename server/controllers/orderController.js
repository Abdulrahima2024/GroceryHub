import Order from "../models/Order.js";
import Product from "../models/Product.js";



//Place Order COD:/api/order/cod
export const placeOrderCOD =async(req ,res)=>{
    try {
        const {items,address ,paymentType} =req.body;
        const userId = req.user._id;
        if(!address ||items.length === 0){
            return res.status(400).json({success: false,message:"Invalid data"})
        }
        
        let amount = 0;

        for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(400).json({ success: false, message: `Product not found: ${item.product}` });
        }
        amount += product.offerprice * item.quantity;
        }
        //ADD Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

         if (!paymentType) {
            return res.status(400).json({ success: false, message: "Payment type is required" });
            }

        //await Order.create({
        const order=new Order({
            userId,
            items,
            //amount,
            amount: Number(amount),
            address,
            paymentType: "COD",
            //paymentType,
            status: 'Order Placed',
            isPaid: false,
        });
        await order.save();
        return res.json({success:true,message:"Order Placed Successfully" })

    }catch(error){
        return res.status(500).json({success: false, message:error.message});
    }
}


//Get Orders by User ID:/api/order/user
export const getUserOrders= async(req , res)=>{
    try {
        //const { userId }=req.body;
        const userId = req.user._id; // comes from authUser middleware
        const orders=await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product").populate("address").sort({createdAt: -1});
        res.json({success: true,orders});
    } catch (error) {
        res.json({success:false,message: error.message});
    }
}


//Get All Orders (for seller/admin):/api/order/seller
export const getAllOrders= async(req , res)=>{
    try {
       
        const orders=await Order.find({
         
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product").populate("address").sort({createdAt: -1});
        res.json({success: true,orders});
    } catch (error) {
        res.json({success:false,message: error.message});
    }
}