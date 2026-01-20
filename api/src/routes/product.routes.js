const express = require('express');

/**
 * @swagger
 * /api/products/lost:
 *   get:
 *     summary: Get lost products
 *     description: Returns products that were borrowed 3+ months ago and have not been returned
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of lost products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         example: "PROD-001"
 *                       userId:
 *                         type: string
 *                         example: "USR-123"
 *                       location:
 *                         type: string
 *                         example: "Store A"
 *                       lastBorrowDate:
 *                         type: string
 *                         format: date-time
 *                       transactionId:
 *                         type: string
 *                         example: "TXN-001"
 *                       daysSinceBorrow:
 *                         type: integer
 *                         example: 95
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/expiring-payments:
 *   get:
 *     summary: Get borrows with expiring payments
 *     description: Returns active borrows where the user's payment method expires within 30 days
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of borrows with expiring payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         example: "PROD-002"
 *                       userId:
 *                         type: string
 *                         example: "USR-456"
 *                       borrowDate:
 *                         type: string
 *                         format: date-time
 *                       location:
 *                         type: string
 *                         example: "Store B"
 *                       transactionId:
 *                         type: string
 *                         example: "TXN-002"
 *                       paymentValidUntil:
 *                         type: string
 *                         example: "01/25"
 *                       paymentExpiryDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-31"
 *                       paymentStatus:
 *                         type: string
 *                         enum: [expired, critical, warning, ok]
 *                         example: "warning"
 *       500:
 *         description: Server error
 */
const createProductRoutes = (controller) => {
  const router = express.Router();

  router.get('/lost', controller.getLostProducts);
  router.get('/expiring-payments', controller.getExpiringPayments);

  return router;
};

module.exports = createProductRoutes;
