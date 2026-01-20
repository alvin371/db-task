const express = require('express');
const { pool } = require('../config/database');

const ProductEventRepository = require('../repositories/productEvent.repository');
const UserEventRepository = require('../repositories/userEvent.repository');

const ProductService = require('../services/product.service');

const healthController = require('../controllers/health.controller');
const ProductController = require('../controllers/product.controller');

const createHealthRoutes = require('./health.routes');
const createProductRoutes = require('./product.routes');

const router = express.Router();

// Dependency Injection Setup
const productEventRepository = new ProductEventRepository(pool);
const userEventRepository = new UserEventRepository(pool);

const productService = new ProductService(productEventRepository, userEventRepository);

const productController = new ProductController(productService);

// Register Routes
router.use('/health', createHealthRoutes(healthController));
router.use('/products', createProductRoutes(productController));

module.exports = router;
