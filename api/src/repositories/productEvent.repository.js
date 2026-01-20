const BaseRepository = require('./base.repository');

class ProductEventRepository extends BaseRepository {
  async findLostProducts(cutoffDate) {
    const sql = `
      SELECT
        pe.product_id,
        pe.user_id,
        pe.location,
        pe.evt_date AS borrow_date,
        pe.transaction_id,
        pe.location_id,
        pe.platform
      FROM product_events pe
      WHERE pe.evt_type = 'borrow'
        AND pe.evt_date < $1
        AND NOT EXISTS (
          SELECT 1
          FROM product_events ret
          WHERE ret.evt_type = 'return'
            AND ret.transaction_id = pe.transaction_id
        )
      ORDER BY pe.evt_date ASC
    `;

    return this.query(sql, [cutoffDate]);
  }

  async findActiveBorrows() {
    const sql = `
      SELECT
        pe.product_id,
        pe.user_id,
        pe.location,
        pe.evt_date AS borrow_date,
        pe.transaction_id,
        pe.location_id,
        pe.platform
      FROM product_events pe
      WHERE pe.evt_type = 'borrow'
        AND NOT EXISTS (
          SELECT 1
          FROM product_events ret
          WHERE ret.evt_type = 'return'
            AND ret.transaction_id = pe.transaction_id
        )
      ORDER BY pe.evt_date ASC
    `;

    return this.query(sql, []);
  }
}

module.exports = ProductEventRepository;
