const { User } = require('../models/user');

exports.create = async (data) => {
  return await User.create(data);
};

exports.findAll = async () => {
  return await User.findAll();
};

exports.findById = async (id) => {
  return await User.findByPk(id);
};

exports.update = async (id, data) => {
  const item = await User.findByPk(id);
  if (!item) throw new Error('Not found');
  return await item.update(data);
};

exports.delete = async (id) => {
  const item = await User.findByPk(id);
  if (!item) throw new Error('Not found');
  return await item.destroy();
};

exports.adminMethod = async () => {
  // Example of admin-specific logic
  return 'Admin-specific logic here';
};