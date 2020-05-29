const BookModel = require('../models/BookModel');

exports.get_books = async (req, res, next) => {
  try {
    const options = { collation: { 'locale': 'en' }, sort: { 'title': 1 } }
    const books = await BookModel.find({}, null, options);
    if (!books.length) return res.status(400).json({ error: 'There are no books in library' });
    const response = books.map(book => {
      return { '_id': book._id, 'title': book.title, 'commentcount': book.comments.length };
    });
    res.json(response);
  } catch (err) {
    next(err);
  }
};

exports.get_book = async (req, res, next) => {
  try {
    const foundBook = await BookModel.findById(req.params.id, { '__v': false });
    if (!foundBook) return res.status(400).json({ error: 'Book with this ID does not exist' });
    res.json(foundBook);
  } catch (err) {
    next(err);
  }
};

exports.create_book = async (req, res, next) => {
  const { title } = req.body;
  try {
    const foundBook = await BookModel.findOne({ title });
    if (foundBook) return res.json({ _id: foundBook._id, title: foundBook.title });
    const newBook = await BookModel.create({ title });
    res.status(201).json({ _id: newBook._id, title: newBook.title });
  } catch (err) {
    next(err);
  }
};

exports.create_comment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const update = { $push: { comments: req.body.comment } };
    const options = { new: true, fields: { '__v': false } };
    const updatedBook = await BookModel.findByIdAndUpdate(id, update, options);
    if (!updatedBook) return res.json({ error: 'Book with this ID does not exist' });
    res.json(updatedBook);
  } catch (err) {
    next(err);
  }
};

exports.delete_book = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedBook = await BookModel.findByIdAndDelete(id);
    if (!deletedBook) return res.status(400).json({ error: 'Book with this ID does not exist' });
    res.json({ success: `Successfully deleted book - ${id}` });
  } catch (err) {
    next(err);
  }
};

exports.delete_books = async (req, res, next) => {
  try {
    const deletedBooks = await BookModel.deleteMany({});
    if (deletedBooks.n > 0) {
      res.json({ success: `You have successfully deleted ${deletedBooks.n} ${deletedBooks.n === 1 ? 'book' : 'books'}` });
    } else {
      res.status(400).json({ error: 'There are no books in library' });
    }
  } catch (err) {
    next(err);
  }
};