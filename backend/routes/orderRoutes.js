import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
  .get(getUserOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById)
  .put(updateOrderStatus);

router.put('/:id/cancel', cancelOrder);

export default router;
