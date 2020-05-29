window.onload = () => {

  const booksList = document.querySelector('.books-list');
  const newBookTitle = document.getElementById('new-book-title');
  const addBookBtn = document.getElementById('add-book');
  const modal = document.querySelector('.modal');
  const bookDetails = document.querySelector('.book-details');
  const commentsBlock = document.querySelector('.new-comments');

  function renderBooks(books) {
    if (!books.length) {
      booksList.innerHTML = '<div class="total">Total number of books in the library: <span class="count">0</span></div>';
    } else {
      let HTML = `<div class="total">Total number of books in the library: <span class="count">${books.length}</span></div>`;
      for (let book of books) {
        HTML += `
          <li class="book" data-id="${book._id}">
            <p class="book-title">${book.title}</p>
            <p class="comments-count">Comments: ${book.commentcount}</p>
            <i id="delete-book" class="fas fa-trash-alt" title="Delete this book from the library"></i>
          </li>`;
      }
      booksList.innerHTML = HTML;
    }
    booksList.classList.add('visible');
  }

  function createBook(e) {
    const title = newBookTitle.value;
    if (!title.trim()) return;
    e.preventDefault();
    fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ title })
      })
      .then(() => {
        newBookTitle.value = '';
        booksList.classList.remove('visible');
        getBooks();
      })
      .catch(err => console.log(err));
  }

  function deleteBook(book) {
    const { id } = book.dataset;
    fetch(`/api/books/${id}`, { method: 'DELETE' })
      .then(() => {
        book.classList.add('hidden');
        setTimeout(() => {
          book.style.display = 'none';
          let count = document.querySelector('.count');
          count.textContent -= 1;
        }, 300);
      })
      .catch(err => console.log(err));
  }

  function renderModal(book) {
    const { id } = book.dataset;
    fetch(`/api/books/${id}`)
      .then(response => response.json())
      .then(book => {
        const comments = book.comments.map(comment => `<li class="comment">${comment}</li>`);
        commentsBlock.setAttribute('data-id', book._id);
        bookDetails.innerHTML = `
          <h2>${book.title}</h2>         
          <ul class="comments-list">
            ${comments.length ? comments.join('') : 'No comments yet'}
          </ul>`;
        modal.style.display = 'block';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            modal.classList.remove('hidden');
          })
        })
      })
      .catch(err => console.log(err));
  }

  function createComment(e) {
    const { id } = e.target.parentNode.dataset;
    const comment = document.getElementById('comment-input');
    if (!comment.value.trim()) return;
    e.preventDefault();
    const payload = { comment: comment.value };
    fetch(`/api/books/${id}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(result => {
        const commentsList = document.querySelector('.comments-list');
        if (commentsList.textContent.trim() === 'No comments yet') commentsList.textContent = '';
        commentsList.innerHTML += `<li class="comment">${result.comments[result.comments.length - 1]}</li>`;
        comment.value = '';
      })
      .catch(err => console.log(err));
  }

  function delegateModalHandlers(e) {
    const target = e.target;
    if (target.matches('.modal-container') || target.matches('.modal') || target.matches('#cancel-modal')) {
      modal.classList.add('hidden');
      setTimeout(() => modal.style.display = 'none', 300);
      getBooks();
    } else if (target.matches('#add-comment')) {
      createComment(e);
    }
  }

  function delegateHandlers(e) {
    const target = e.target;
    if (target.matches('#delete-book')) {
      if (confirm('Are you sure you want to delete this book?')) {
        deleteBook(target.parentNode);
      }
    } else if (target.parentNode.matches('.book')) {
      renderModal(target.parentNode);
    } else if (target.matches('.book')) {
      renderModal(target);
    }
  };

  function getBooks() {
    fetch('/api/books')
      .then(response => response.json())
      .then(result => renderBooks(result))
      .catch(err => console.log(err));
  }

  getBooks();

  addBookBtn.addEventListener('click', createBook);
  booksList.addEventListener('click', delegateHandlers);
  modal.addEventListener('click', delegateModalHandlers);

}