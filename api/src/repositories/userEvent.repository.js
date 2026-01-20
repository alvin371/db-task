const BaseRepository = require('./base.repository');

class UserEventRepository extends BaseRepository {
  async getLatestPaymentMethod(userId) {
    const sql = `
      SELECT
        user_id,
        evt_date,
        platform,
        meta
      FROM user_events
      WHERE evt_type = 'add-payment-method'
        AND user_id = $1
      ORDER BY evt_date DESC
      LIMIT 1
    `;

    return this.queryOne(sql, [userId]);
  }

  async getAllLatestPaymentMethods() {
    const sql = `
      SELECT DISTINCT ON (user_id)
        user_id,
        evt_date,
        platform,
        meta
      FROM user_events
      WHERE evt_type = 'add-payment-method'
      ORDER BY user_id, evt_date DESC
    `;

    return this.query(sql, []);
  }
}

module.exports = UserEventRepository;
