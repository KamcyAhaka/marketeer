const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'categories';

// Helper: validate category payload (4 fields per FinalProjectProposal)
const validateCategoryPayload = (body) => {
  const { name, description, slug, isActive } = body;

  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('name is required and must be a non-empty string');
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push('description is required and must be a non-empty string');
  }
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    errors.push('slug is required and must be a non-empty string');
  }
  if (isActive === undefined || typeof isActive !== 'boolean') {
    errors.push('isActive is required and must be a boolean (true or false)');
  }

  return errors;
};

// GET all categories
const getAll = async (req, res) => {
  try {
    const categories = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .find()
      .toArray();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve categories', details: err.message });
  }
};

// GET single category by ID
const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    const category = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve category', details: err.message });
  }
};

// POST create a new category
const createCategory = async (req, res) => {
  try {
    const validationErrors = validateCategoryPayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const { name, description, slug, isActive } = body = req.body;

    const newCategory = {
      name: name.trim(),
      description: description.trim(),
      slug: slug.trim().toLowerCase(),
      isActive: Boolean(isActive),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .insertOne(newCategory);

    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
};

// PUT update a category by ID
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    const validationErrors = validateCategoryPayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const { name, description, slug, isActive } = req.body;

    const updatedCategory = {
      name: name.trim(),
      description: description.trim(),
      slug: slug.trim().toLowerCase(),
      isActive: Boolean(isActive),
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .replaceOne({ _id: new ObjectId(id) }, updatedCategory);

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category', details: err.message });
  }
};

// DELETE a category by ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category', details: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createCategory,
  updateCategory,
  deleteCategory,
};
