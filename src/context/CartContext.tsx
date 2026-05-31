import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addToCart, createCart, getCart, removeFromCart, updateCartLine } from '../lib/shopify';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; title: string; image?: string }>({ open: false, title: '' });

  useEffect(() => {
    const savedCartId = localStorage.getItem('shopify_cart_id');
    if (savedCartId) {
      getCart(savedCartId).then(setCart).catch(() => localStorage.removeItem('shopify_cart_id'));
    }
  }, []);

  const showToast = (title: string, image?: string) => {
    setToast({ open: true, title, image });
    setTimeout(() => setToast(t => ({ ...t, open: false })), 3000);
  };

  const addItem = useCallback(async (variantId, quantity = 1, productTitle?: string, productImage?: string) => {
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
      if (productTitle) showToast(productTitle, productImage);
      setCartOpen(true);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cart?.id) return;
    if (quantity < 1) return;
    setLoading(true);
    try {
      const updatedCart = await updateCartLine(cart.id, lineId, quantity);
      setCart(updatedCart);
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
  const checkoutUrl = cart?.checkoutUrl ?? '#';

  return (
    <CartContext.Provider value={{ cart, lines, totalItems, cartOpen, setCartOpen, addItem, updateItem, removeItem, loading, toast, checkoutUrl }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
