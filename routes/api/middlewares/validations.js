const mongoose = require('mongoose');

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json({ error: 'Invalid ID' });
  } else {
    next();
  }
};

const validateTitle = (req, res, next) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    res.json({ error: 'Title is required' })
  } else {
    next();
  }
};

const validateComment = (req, res, next) => {
  const { comment } = req.body;
  if (!comment || !comment.trim()) {
    res.json({ error: 'Comment is required' })
  } else {
    next();
  }
};

module.exports = { validateId, validateTitle, validateComment };