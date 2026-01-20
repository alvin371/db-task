const {
  getDateMonthsAgo,
  daysBetween,
  parsePaymentExpiry,
  getPaymentStatus
} = require('../utils/dateUtils');

class ProductService {
  constructor(productEventRepository, userEventRepository) {
    this.productEventRepository = productEventRepository;
    this.userEventRepository = userEventRepository;
  }

  async getLostProducts() {
    const threeMonthsAgo = getDateMonthsAgo(3);
    const lostProducts = await this.productEventRepository.findLostProducts(threeMonthsAgo);

    return lostProducts.map(product => ({
      productId: product.product_id,
      userId: product.user_id,
      location: product.location,
      lastBorrowDate: product.borrow_date,
      transactionId: product.transaction_id,
      daysSinceBorrow: daysBetween(product.borrow_date)
    }));
  }

  async getExpiringPaymentBorrows() {
    const activeBorrows = await this.productEventRepository.findActiveBorrows();
    const paymentMethods = await this.userEventRepository.getAllLatestPaymentMethods();

    const paymentMap = new Map();
    paymentMethods.forEach(pm => {
      paymentMap.set(pm.user_id, pm);
    });

    const results = [];
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    for (const borrow of activeBorrows) {
      const payment = paymentMap.get(borrow.user_id);

      if (!payment || !payment.meta) continue;

      let meta;
      try {
        meta = typeof payment.meta === 'string' ? JSON.parse(payment.meta) : payment.meta;
      } catch (e) {
        continue;
      }

      const validUntil = meta.valid_until || meta.validUntil;
      if (!validUntil) continue;

      const expiryDate = parsePaymentExpiry(validUntil);
      if (!expiryDate) continue;

      if (expiryDate <= thirtyDaysFromNow) {
        const status = getPaymentStatus(expiryDate);

        results.push({
          productId: borrow.product_id,
          userId: borrow.user_id,
          borrowDate: borrow.borrow_date,
          location: borrow.location,
          transactionId: borrow.transaction_id,
          paymentValidUntil: validUntil,
          paymentExpiryDate: expiryDate.toISOString().split('T')[0],
          paymentStatus: status
        });
      }
    }

    return results;
  }
}

module.exports = ProductService;
