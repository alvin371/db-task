const formatSuccess = (data) => {
  return {
    success: true,
    count: Array.isArray(data) ? data.length : 0,
    data: data || []
  };
};

const formatError = (message) => {
  return {
    success: false,
    error: message
  };
};

module.exports = {
  formatSuccess,
  formatError
};
