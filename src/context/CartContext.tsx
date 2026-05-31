import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addToCart, createCart, getCart, removeFromCart } from '../lib/shopify';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCartId = localStorage.getItem('shopify_cart_id');
    if (savedCartId) {
      getCart(savedCartId).then(setCart).catch(() => localStorage.removeItem('shopify_cart_id'));
    }
  }, []);

  const addItem = useCallback(async (variantId, quantity = 1) => {
    setLoading(true);
    try {
      let updatedCart;
      if (cart?.id) {
        updatedCart = await addToCart(cart.id, variantId, quantity);
      } else {
        updatedCart = await createCart(variantId, quantity);
        localStorage.setItem('shopify_cart_id', updatedCart.id);
      }
      setCart(updatedCart);
      setCartOpen(true);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (lineId) => {
    if (!cart?.id) return;
    setLoading(true);
    try {
      const updatedCart = await removeFromCart(cart.id, lineId);
      setCart(updatedCart);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const totalItems = cart?.totalQuantity ?? 0;
  const lines = cart?.lines?.edges?.map(e => e.node) ?? [];

  return (
    <CartContext.Provider value={{ cart, lines, totalItems, cartOpen, setCartOpen, addItem, removeItem, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
