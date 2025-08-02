exports.generateTemporaryPassword = () =>
  Math.random().toString(36).slice(-8) + Date.now();
