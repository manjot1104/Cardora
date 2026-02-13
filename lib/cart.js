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

// Helper function to check if two items are the same (for merging)
const isSameItem = (item1, item2) => {
  // Check all key properties that should match for merging
  return (
    item1.type === item2.type &&
    item1.templateId === item2.templateId &&
    item1.size === item2.size &&
    item1.orientation === item2.orientation &&
    item1.printType === item2.printType &&
    item1.country === item2.country &&
    item1.cardType === item2.cardType &&
    item1.currency === item2.currency
  );
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
    
    // Check if same item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => isSameItem(cartItem, item));
    
    if (existingItemIndex !== -1) {
      // Merge with existing item - add quantities and recalculate price
      const existingItem = cart[existingItemIndex];
      const newQuantity = (existingItem.quantity || 0) + (item.quantity || 0);
      const newPrice = (existingItem.unitPrice || 0) * newQuantity;
      
      // Extract base name (remove quantity prefix if exists)
      let baseName = existingItem.name;
      const nameMatch = existingItem.name.match(/^\d+\s+(.+)$/);
      if (nameMatch) {
        baseName = nameMatch[1]; // Get everything after the quantity number
      }
      
      // Update existing item
      cart[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        price: newPrice,
        name: `${newQuantity} ${baseName}`, // Update name with new quantity
      };
      
      console.log('🛒 addToCart: Merged with existing item. New quantity:', newQuantity);
    } else {
      // Add as new item
      const newItem = {
        ...item,
        id: `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date().toISOString(),
      };
      
      console.log('🛒 addToCart: New item with ID:', newItem);
      cart.push(newItem);
    }
    
    console.log('🛒 addToCart: Cart after add/merge:', cart);
    
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
