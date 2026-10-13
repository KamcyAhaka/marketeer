const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'orders';

// Helper: validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};

// Helper: validate order payload (6 fields per FinalProjectProposal)
const validateOrderPayload = (body) => {
  const {
    userId,
    customerEmail,
    items,
    totalAmount,
    shippingAddress,
    orderStatus,
  } = body;

  const errors = [];

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    errors.push('userId is required and must be a non-empty string');
  }

  if (!customerEmail || !isValidEmail(customerEmail)) {
    errors.push('customerEmail is required and must be a valid email address');
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.push('items is required and must be a non-empty array of order items');
  } else {
    items.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`items[${index}] must be a valid item object`);
      } else {
        if (!item.productId || typeof item.productId !== 'string' || item.productId.trim() === '') {
          errors.push(`items[${index}].productId is required`);
        }
        if (item.quantity === undefined || typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
          errors.push(`items[${index}].quantity must be a positive integer`);
        }
        if (item.unitPrice === undefined || typeof item.unitPrice !== 'number' || item.unitPrice <= 0) {
          errors.push(`items[${index}].unitPrice must be a positive number`);
        }
      }
    });
  }

  if (totalAmount === undefined || typeof totalAmount !== 'number' || totalAmount <= 0) {
    errors.push('totalAmount is required and must be a positive number');
  }

  if (!shippingAddress) {
    errors.push('shippingAddress is required');
  } else if (typeof shippingAddress === 'string') {
    if (shippingAddress.trim() === '') {
      errors.push('shippingAddress string cannot be empty');
    }
  } else if (typeof shippingAddress === 'object') {
    if (!shippingAddress.street || typeof shippingAddress.street !== 'string') {
      errors.push('shippingAddress.street is required');
    }
    if (!shippingAddress.city || typeof shippingAddress.city !== 'string') {
      errors.push('shippingAddress.city is required');
    }
    if (!shippingAddress.zipCode || typeof shippingAddress.zipCode !== 'string') {
      errors.push('shippingAddress.zipCode is required');
    }
    if (!shippingAddress.country || typeof shippingAddress.country !== 'string') {
      errors.push('shippingAddress.country is required');
    }
  } else {
    errors.push('shippingAddress must be a string or address object');
  }

  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!orderStatus || typeof orderStatus !== 'string' || !validStatuses.includes(orderStatus)) {
    errors.push(`orderStatus must be one of: ${validStatuses.join(', ')}`);
  }

  return errors;
};

// GET all orders
const getAll = async (req, res) => {
  try {
    const orders = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .find()
      .toArray();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve orders', details: err.message });
  }
};

// GET single order by ID
const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve order', details: err.message });
  }
};

// POST create a new order
const createOrder = async (req, res) => {
  try {
    const validationErrors = validateOrderPayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const {
      userId,
      customerEmail,
      items,
      totalAmount,
      shippingAddress,
      orderStatus,
    } = req.body;

    const newOrder = {
      userId: userId.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      items: items.map((item) => ({
        productId: item.productId.trim(),
        title: item.title ? item.title.trim() : undefined,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      totalAmount: Number(totalAmount),
      shippingAddress:
        typeof shippingAddress === 'string'
          ? shippingAddress.trim()
          : {
              street: shippingAddress.street.trim(),
              city: shippingAddress.city.trim(),
              state: shippingAddress.state ? shippingAddress.state.trim() : '',
              zipCode: shippingAddress.zipCode.trim(),
              country: shippingAddress.country.trim(),
            },
      orderStatus: orderStatus.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .insertOne(newOrder);

    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
};

// PUT update an order by ID
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const validationErrors = validateOrderPayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const {
      userId,
      customerEmail,
      items,
      totalAmount,
      shippingAddress,
      orderStatus,
    } = req.body;

    const updatedOrder = {
      userId: userId.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      items: items.map((item) => ({
        productId: item.productId.trim(),
        title: item.title ? item.title.trim() : undefined,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      totalAmount: Number(totalAmount),
      shippingAddress:
        typeof shippingAddress === 'string'
          ? shippingAddress.trim()
          : {
              street: shippingAddress.street.trim(),
              city: shippingAddress.city.trim(),
              state: shippingAddress.state ? shippingAddress.state.trim() : '',
              zipCode: shippingAddress.zipCode.trim(),
              country: shippingAddress.country.trim(),
            },
      orderStatus: orderStatus.trim(),
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .replaceOne({ _id: new ObjectId(id) }, updatedOrder);

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
};

// DELETE an order by ID
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order', details: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createOrder,
  updateOrder,
  deleteOrder,
};
