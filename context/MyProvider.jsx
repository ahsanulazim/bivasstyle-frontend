"use client";
import { getAllCategories } from "@/api/categoryApi";
import { getAllLocations } from "@/api/locationApi";
import { getAllProducts } from "@/api/productApi";
import { getAllShippingRates } from "@/api/shippingApi";
import { api } from "@/axios/axiosInstance";
import { auth } from "@/firebase/firebase.config";
import { useQuery } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setNewUser(JSON.parse(storedUser));
    }

    // Firebase observer
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        const email = user.email;
        try {
          const res = await api.get("/users/getUser", {
            params: {
              email,
            },
          });
          setNewUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          setLoading(false);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("New user registered, waiting for DB sync...");
            setLoading(false);
          } else {
            console.error("Error fetching user data:", error);
            setLoading(false);
          }
        }
      } else {
        setNewUser(null);
        localStorage.removeItem("user");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // products fetching
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // cart & wishlist & coupon logic
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Load cart & wishlist from localStorage on initial render safely
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Cart storage parsing error:", error);
      }
    }

    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch (error) {
        console.error("Wishlist storage parsing error:", error);
      }
    }

    setIsHydrated(true);
  }, []);

  // 2. Save cart & wishlist to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      if (cartItems.length === 0) {
        setAppliedCoupon(null);
      }
    }
  }, [cartItems, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isHydrated]);

  // 3. Add function to update cart items
  const addToCart = (product, variant, size, quantity) => {
    const cartItemId = `${product._id}-${variant.color}-${size}`;

    // Check if product variant already exists in cart
    const existingCartItem = cartItems.find((item) => item.id === cartItemId);

    const activeSizeDetail = variant?.sizes?.find((s) => s.size === size);
    const stock = activeSizeDetail ? activeSizeDetail.stock : 0;

    if (existingCartItem) {
      const newQuantiy = existingCartItem.quantity + quantity;

      if (newQuantiy > stock) {
        toast.error("Product is out of stock");
        return false;
      }
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantiy } : item,
        ),
      );
    } else {
      if (quantity > stock) {
        toast.error("Product is out of stock");
        return false;
      }
      const newCartItem = {
        id: cartItemId,
        productId: product._id,
        productName: product.productName,
        color: variant.color,
        size: size,
        quantity: quantity,
        price:
          Number(activeSizeDetail?.discount) > 0
            ? Number(activeSizeDetail.discount)
            : Number(activeSizeDetail?.price) > 0
              ? Number(activeSizeDetail.price)
              : Number(product.discount) > 0
                ? Number(product.discount)
                : Number(product.price),
        image: variant?.imageGallery?.[0] || product.productImages?.[0],
        stock: stock,
      };
      setCartItems((prevCartItems) => [...prevCartItems, newCartItem]);
    }
    return true;
  };

  const removeFromCart = (id) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== id),
    );
  };

  const updateCartItemQuantity = (id, quantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist functions
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const toggleWishlist = (product) => {
    if (!product || !product._id) return;
    const exists = wishlistItems.some((item) => item._id === product._id);
    if (exists) {
      setWishlistItems((prev) =>
        prev.filter((item) => item._id !== product._id),
      );
      toast.info(`${product.productName} removed from Wishlist`);
    } else {
      setWishlistItems((prev) => [
        ...prev,
        {
          _id: product._id,
          productName: product.productName,
          slug: product.slug,
          category: product.category,
          price: product.price,
          discount: product.discount,
          productImages: product.productImages,
          variantDetails: product.variantDetails,
        },
      ]);
      toast.success(`${product.productName} added to Wishlist`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const calculateTotalPrice = () => {
    if (cartItems.length === 0) {
      return 0;
    }
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const calculateTotalItem = () => {
    if (cartItems.length === 0) {
      return 0;
    }
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // fetch location data
  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: getAllLocations,
  });

  // fetch shipping data
  const { data: shippingRates, isLoading: shippingRatesLoading } = useQuery({
    queryKey: ["shippingRates"],
    queryFn: getAllShippingRates,
  });

  const [deliveryAdd, setDeliveryAdd] = useState(null);

  // get delivery charge
  const [shippingPrice, setShippingPrice] = useState(null);

  useEffect(() => {
    if (deliveryAdd) {
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/shippingRates/getShippingRateByDistrict?district=${deliveryAdd}`,
      )
        .then((res) => res.json())
        .then((data) => setShippingPrice(data));
    }
  }, [deliveryAdd]);

  // categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const data = {
    newUser,
    setNewUser,
    loading,
    products,
    productsLoading,
    cartItems,
    isHydrated,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    appliedCoupon,
    setAppliedCoupon,
    clearCoupon,
    wishlistItems,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    calculateTotalPrice,
    calculateTotalItem,
    locations,
    locationsLoading,
    shippingRates,
    shippingRatesLoading,
    deliveryAdd,
    setDeliveryAdd,
    shippingPrice,
    categories,
    categoriesLoading,
    categoriesError,
  };

  return <MyContext value={data}>{children}</MyContext>;
};

export default MyProvider;
