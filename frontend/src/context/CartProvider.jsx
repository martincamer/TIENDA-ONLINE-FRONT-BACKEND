import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "shopping_cart";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem(CART_STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  const [total, setTotal] = useState(() => {
    try {
      const localData = localStorage.getItem(CART_STORAGE_KEY);
      const cartData = localData ? JSON.parse(localData) : [];
      return cartData.reduce(
        (acc, item) => acc + item.precio_venta * item.cantidad,
        0
      );
    } catch (error) {
      console.error("Error calculating initial total:", error);
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      calcularTotal();
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const calcularTotal = () => {
    try {
      const total = cart.reduce(
        (acc, item) => acc + item.precio_venta * item.cantidad,
        0
      );
      setTotal(total);
    } catch (error) {
      console.error("Error calculating total:", error);
    }
  };

  const addToCart = (producto, cantidad) => {
    try {
      setCart((prevCart) => {
        const existingProduct = prevCart.find(
          (item) => item._id === producto._id
        );

        const newCart = existingProduct
          ? prevCart.map((item) =>
              item._id === producto._id
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item
            )
          : [...prevCart, { ...producto, cantidad }];

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = (productoId) => {
    try {
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => item._id !== productoId);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = (productoId, cantidad) => {
    try {
      setCart((prevCart) => {
        const newCart = prevCart.map((item) =>
          item._id === productoId ? { ...item, cantidad } : item
        );
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = () => {
    try {
      setCart([]);
      setTotal(0);
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const isInCart = (productoId) => {
    return cart.some((item) => item._id === productoId);
  };

  const getQuantityInCart = (productoId) => {
    const item = cart.find((item) => item._id === productoId);
    return item ? item.cantidad : 0;
  };

  console.log(cart);
  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getQuantityInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
