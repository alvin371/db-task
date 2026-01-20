const { formatSuccess } = require('../utils/responseFormatter');

class ProductController {
  constructor(productService) {
    this.productService = productService;

    this.getLostProducts = this.getLostProducts.bind(this);
    this.getExpiringPayments = this.getExpiringPayments.bind(this);
  }

  async getLostProducts(req, res, next) {
    try {
      const products = await this.productService.getLostProducts();
      res.json(formatSuccess(products));
    } catch (error) {
      next(error);
    }
  }

  async getExpiringPayments(req, res, next) {
    try {
      const borrows = await this.productService.getExpiringPaymentBorrows();
      res.json(formatSuccess(borrows));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
