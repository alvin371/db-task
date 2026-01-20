class BaseRepository {
  constructor(pool) {
    if (!pool) {
      throw new Error('Database pool is required');
    }
    this.pool = pool;
  }

  async query(sql, params = []) {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async queryOne(sql, params = []) {
    const rows = await this.query(sql, params);
    return rows[0] || null;
  }
}

module.exports = BaseRepository;
