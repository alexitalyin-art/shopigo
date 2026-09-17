"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "shopigo-cart";

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [items, loaded]);

  function addToCart(item: CartItem) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem
        );
      }

      return [...currentItems, item];
    });
  }

  function removeFromCart(
    productId: string,
    size?: string,
    color?: string
  ) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            item.color === color
          )
      )
    );
  }

  function updateQuantity(
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}