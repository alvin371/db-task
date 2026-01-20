const getDateMonthsAgo = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
};

const daysBetween = (startDate, endDate = new Date()) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const parsePaymentExpiry = (mmyy) => {
  if (!mmyy || typeof mmyy !== 'string') return null;

  const match = mmyy.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return null;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;

  if (month < 1 || month > 12) return null;

  // Last day of the month (month is 0-indexed, so month value gives next month, day 0 gives last day)
  return new Date(year, month, 0, 23, 59, 59, 999);
};

const getPaymentStatus = (expiryDate) => {
  if (!expiryDate) return 'unknown';

  const now = new Date();

  if (expiryDate < now) return 'expired';

  const daysUntilExpiry = daysBetween(now, expiryDate);

  if (daysUntilExpiry <= 7) return 'critical';
  if (daysUntilExpiry <= 30) return 'warning';
  return 'ok';
};

module.exports = {
  getDateMonthsAgo,
  daysBetween,
  parsePaymentExpiry,
  getPaymentStatus
};
