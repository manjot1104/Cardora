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
  if (typeof window === 'undefined') {
    console.error('❌ addToCart: Window is undefined');
    return [];
  }
  
  if (!item) {
    console.error('❌ addToCart: Item is null or undefined');
    return [];
  }
  
  try {
    console.log('🛒 addToCart: Adding item:', item);
    const cart = getCart();
    console.log('🛒 addToCart: Current cart:', cart);
    
    const newItem = {
      ...item,
      id: `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString(),
    };
    
    console.log('🛒 addToCart: New item with ID:', newItem);
    
    cart.push(newItem);
    console.log('🛒 addToCart: Cart after push:', cart);
    
    const cartJson = JSON.stringify(cart);
    console.log('🛒 addToCart: Cart JSON length:', cartJson.length);
    
    localStorage.setItem(CART_KEY, cartJson);
    
    // Verify it was saved
    const verifyCart = localStorage.getItem(CART_KEY);
    if (!verifyCart) {
      console.error('❌ addToCart: Failed to save to localStorage');
      return [];
    }
    
    const parsedCart = JSON.parse(verifyCart);
    console.log('🛒 addToCart: Verified cart from localStorage:', parsedCart);
    console.log('✅ addToCart: Successfully added item to cart');
    
    return parsedCart;
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
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
