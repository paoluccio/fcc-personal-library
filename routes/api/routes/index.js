const express = require('express');
const BookController = require('../controllers/BookController');
const { validateId, validateTitle, validateComment } = require('../middlewares/validations');

const api = express.Router();

// Get
api.get('/books', BookController.get_books);
api.get('/books/:id', validateId, BookController.get_book);

// Create
api.post('/books', validateTitle, BookController.create_book);
api.post('/books/:id', validateId, validateComment, BookController.create_comment);

// Delete
api.delete('/books', BookController.delete_books);
api.delete('/books/:id', validateId, BookController.delete_book);

module.exports = api;