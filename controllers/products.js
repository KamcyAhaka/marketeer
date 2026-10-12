const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'products';

// Helper: validate product payload (9 fields per FinalProjectProposal)
const validateProductPayload = (body) => {
  const {
    title,
    description,
    price,
    category,
    stockQuantity,
    brand,
    sku,
    rating,
    imageUrl,
  } = body;

  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('title is required and must be a non-empty string');
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push('description is required and must be a non-empty string');
  }
  if (price === undefined || typeof price !== 'number' || price <= 0) {
    errors.push('price is required and must be a positive number');
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('category is required and must be a non-empty string');
  }
  if (
    stockQuantity === undefined ||
    typeof stockQuantity !== 'number' ||
    stockQuantity < 0 ||
    !Number.isInteger(stockQuantity)
  ) {
    errors.push('stockQuantity is required and must be a non-negative integer');
  }
  if (!brand || typeof brand !== 'string' || brand.trim() === '') {
    errors.push('brand is required and must be a non-empty string');
  }
  if (!sku || typeof sku !== 'string' || sku.trim() === '') {
    errors.push('sku is required and must be a non-empty string');
  }
  if (
    rating === undefined ||
    typeof rating !== 'number' ||
    rating < 0 ||
    rating > 5
  ) {
    errors.push('rating is required and must be a number between 0 and 5');
  }
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    errors.push('imageUrl is required and must be a valid non-empty string URL');
  }

  return errors;
};

// GET all products
const getAll = async (req, res) => {
  try {
    const products = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .find()
      .toArray();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products', details: err.message });
  }
};

// GET single product by ID
const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const product = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve product', details: err.message });
  }
};

// POST create a new product
const createProduct = async (req, res) => {
  try {
    const validationErrors = validateProductPayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const {
      title,
      description,
      price,
      category,
      stockQuantity,
      brand,
      sku,
      rating,
      imageUrl,
    } = req.body;

    const normalizedSku = sku.trim().toUpperCase();

    // Enforce unique SKU
    const existingSku = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .findOne({ sku: normalizedSku });

    if (existingSku) {
      return res.status(400).json({
        error: `A product with SKU '${normalizedSku}' already exists`,
      });
    }

    const newProduct = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      stockQuantity: Number(stockQuantity),
      brand: brand.trim(),
      sku: normalizedSku,
      rating: Number(rating),
      imageUrl: imageUrl.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .insertOne(newProduct);

    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
};

// PUT update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const validationErrors = validateProductPayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const {
      title,
      description,
      price,
      category,
      stockQuantity,
      brand,
      sku,
      rating,
      imageUrl,
    } = req.body;

    const normalizedSku = sku.trim().toUpperCase();

    // Enforce unique SKU across other products
    const existingSku = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .findOne({
        sku: normalizedSku,
        _id: { $ne: new ObjectId(id) },
      });

    if (existingSku) {
      return res.status(400).json({
        error: `Another product with SKU '${normalizedSku}' already exists`,
      });
    }

    const updatedProduct = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      stockQuantity: Number(stockQuantity),
      brand: brand.trim(),
      sku: normalizedSku,
      rating: Number(rating),
      imageUrl: imageUrl.trim(),
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .replaceOne({ _id: new ObjectId(id) }, updatedProduct);

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
};

// DELETE a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createProduct,
  updateProduct,
  deleteProduct,
};
