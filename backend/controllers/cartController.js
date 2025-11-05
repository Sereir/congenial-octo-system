import Cart from '../models/Cart.js';

// Get cart
export const getCart = async (req, res) => {
  try {
    const { sessionId, userId } = req.query;
    
    let query = {};
    if (userId) {
      query.user = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.status(400).json({ success: false, message: 'Session ID or User ID required' });
    }
    
    let cart = await Cart.findOne(query)
      .populate('items.product')
      .populate('restaurant');
    
    if (!cart) {
      cart = await Cart.create(query);
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { sessionId, userId, productId, quantity, price, restaurantId } = req.body;
    
    let query = {};
    if (userId) {
      query.user = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.status(400).json({ success: false, message: 'Session ID or User ID required' });
    }
    
    let cart = await Cart.findOne(query);
    
    if (!cart) {
      cart = await Cart.create({
        ...query,
        restaurant: restaurantId,
        items: [{ product: productId, quantity, price }]
      });
    } else {
      // Check if restaurant is different
      if (cart.restaurant && cart.restaurant.toString() !== restaurantId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot add items from different restaurants' 
        });
      }
      
      // Check if item already exists
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );
      
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }
      
      cart.restaurant = restaurantId;
      await cart.save();
    }
    
    cart = await cart.populate('items.product').populate('restaurant');
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { sessionId, userId, productId, quantity } = req.body;
    
    let query = {};
    if (userId) {
      query.user = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.status(400).json({ success: false, message: 'Session ID or User ID required' });
    }
    
    const cart = await Cart.findOne(query);
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    await cart.populate('items.product').populate('restaurant');
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { sessionId, userId } = req.query;
    const { productId } = req.params;
    
    let query = {};
    if (userId) {
      query.user = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.status(400).json({ success: false, message: 'Session ID or User ID required' });
    }
    
    const cart = await Cart.findOne(query);
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    
    await cart.save();
    await cart.populate('items.product').populate('restaurant');
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { sessionId, userId } = req.query;
    
    let query = {};
    if (userId) {
      query.user = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.status(400).json({ success: false, message: 'Session ID or User ID required' });
    }
    
    const cart = await Cart.findOne(query);
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items = [];
    cart.restaurant = null;
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
