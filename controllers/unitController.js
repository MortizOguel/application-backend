const Unit = require('../models/unitModel');

const createUnit = async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    res.status(201).json({ message: 'Unidad registrada', data: unit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUnit };