import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

// ✅ Axios setup
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// ✅ Create context
const AppContext = createContext();

// ✅ Provider component
const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

const [addresses, setAddresses] = useState([]);
const [selectedAddress, setSelectedAddress] = useState(null);

// Fetch addresses for logged-in user
const fetchAddresses = async () => {
  if (!user) return;
  try {
    const { data } = await axios.get('/api/address/get', { withCredentials: true });
    if (data.success) {
      setAddresses(data.addresses);
      if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};





  // ✅ Check seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    } finally {
      setIsLoading(false);
    }
  };

//Fetch user Auth status,user data and cart items
  const fetchUser=async()=>{
    try {
      const {data}=await axios.get('/api/user/is-auth');
      if(data.success){
        setUser(data.user)
        setCartItems(data.user.cartItems || {});
      }
    } catch (error) {
      setUser(null)
    }
  }



  // ✅ Load dummy products
  const fetchProducts = async () => {
    try {
      const {data}=await axios.get('/api/product/list')
      if(data.success){
        setProducts(data.products)
      }else{
         setProducts([]);
      }
    } catch (error) {
           setProducts([]);
    }
  };

  // ✅ Cart logic
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId];
    }
    setCartItems(cartData);
    toast.success("Removed from Cart");
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, val) => acc + val, 0);
  };

const getCartAmount = () => {
  let total = 0;
  for (const key in cartItems) {
    const product = products.find((p) => p._id === key);
    if (product) {
      const price = Number(product.offerprice) || Number(product.price) || 0;
      const qty = Number(cartItems[key]) || 0;
      total += price * qty;
    }
  }
  return Number(total.toFixed(2)); // Always return a valid number
};


  // ✅ Logout seller
  const logoutSeller = async () => {
  try {
    const { data } = await axios.post("/api/seller/logout");
    if (data.success) {
      toast.success(data.message);
      setIsSeller(false);
      setUser(null);
      localStorage.removeItem("user"); // ✅ clear localStorage
      navigate("/");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed");
  }
};


  // ✅ Initial fetch
  useEffect(() => {
  // ✅ Restore user from localStorage first
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }

  fetchUser();
  fetchSeller();
  fetchProducts();
}, []);
//Update Database Cart Items
  useEffect(()=>{
    const updateCart =async()=>{
      try {
        const {data}=await axios.post('/api/cart/update',{cartItems});
        if(!data.success){
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    if(user){
      updateCart()
    }
  },[cartItems]);

  useEffect(() => {
  if (user) fetchAddresses();
}, [user]);

  // ✅ Values to provide
  const value = {
    axios,
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    currency,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartCount,
    getCartAmount,
    logoutSeller,
    isLoading,fetchProducts,addresses,selectedAddress,setSelectedAddress,setAddresses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ✅ Custom hook (not exported inline)
const useAppContext = () => useContext(AppContext);

// ✅ Final named exports (no duplicates)
export { AppContextProvider, useAppContext };
