import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// Create order from cart
export const createOrder = async (req, res) => {
  try {
    const { sessionId, userId, deliveryAddress, paymentMethod } = req.body;
    
    let query = {};
    if (userId) {
      query.user = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.status(400).json({ success: false, message: 'Session ID or User ID required' });
    }
    
    const cart = await Cart.findOne(query).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    
    // Create order from cart
    const orderData = {
      ...query,
      restaurant: cart.restaurant,
      items: cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      deliveryAddress,
      paymentMethod,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    };
    
    const order = await Order.create(orderData);
    
    // Clear cart after order is created
    cart.items = [];
    cart.restaurant = null;
    await cart.save();
    
    const populatedOrder = await Order.findById(order._id)
      .populate('restaurant')
      .populate('items.product');
    
    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
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
    
    const orders = await Order.find(query)
      .populate('restaurant')
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('restaurant').populate('items.product');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel order in current status' 
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
