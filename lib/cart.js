// Cart functionality for business cards

const CART_KEY = 'cardora_cart';

export const getCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

export const addToCart = (item) => {
  if (typeof window === 'undefined') return;
  try {
    const cart = getCart();
    const newItem = {
      ...item,
      id: `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString(),
    };
    cart.push(newItem);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return [];
  }
};

export const removeFromCart = (itemId) => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return [];
  }
};

export const clearCart = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price || 0), 0);
};

export const updateCartItem = (itemId, updates) => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = getCart();
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  } catch (error) {
    console.error('Error updating cart:', error);
    return [];
  }
};
