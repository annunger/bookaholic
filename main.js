/**
 * IMPORTS
 */

import { insertBook, fetchBooks, deleteBook } from "./db.js";


/**
 * CREATE NEW BOOK
 * creates and displays a new book card
 * 
 * @param {Object} book - book data
 * @param {string} book.title - book title
 * @param {string} book.author - book author
 * @param {number} book.publication - publication year
 * @param {string} book.cover - cover image URL
 * 
 */

const booksContainer = document.getElementById('book-container');

function createBookCard (book) {

    const bookCard = document.createElement('article');
    bookCard.classList.add('book-card');    

    bookCard.innerHTML = `
        <img class="book-cover" src="${book.cover}" alt=" ${book.title}">

        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <p class="book-publication">${book.publication}</p>
            <button class="delete-button" aria-label="Delete book">×</button>
        </div>
    `;

    booksContainer.append(bookCard);

    const deleteButton = bookCard.querySelector('.delete-button');

    deleteButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (confirm('Are you sure?')) {
        deleteBook(book.id).then(() => {
        bookCard.remove();
        });
    }
 });
}


/**
 * SEARCH BOOK
 * Searches for books 2 seconds after the user stops typing
 * and displays the first five results.
 */

const searchInput = document.getElementById('book-search');
const searchResults = document.getElementById('search-results');

let searchTimeout;

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);

  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = '';
    return;
  }

  searchTimeout = setTimeout(() => {
    searchBooks(query);
  }, 200);
});


function searchBooks(query) {
  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      const results = data.docs.slice(0, 5);

      searchResults.innerHTML = '';

      results.forEach(apiBook => {
        const resultItem = document.createElement('button');

        resultItem.classList.add('search-result');
        resultItem.type = 'button';

        resultItem.textContent =
          `${apiBook.title} — ${apiBook.author_name?.[0] || 'Unknown author'} — ${apiBook.first_publish_year || 'Unknown year'}`;

        resultItem.addEventListener('click', () => {
          const book = {
            title: apiBook.title,
            author: apiBook.author_name?.[0] || 'Unknown author',
            publication: apiBook.first_publish_year || null,
            cover: apiBook.cover_i
              ? `https://covers.openlibrary.org/b/id/${apiBook.cover_i}-M.jpg`
              : ''
          };

          insertBook(book)
            .then(savedBook => {
              createBookCard(savedBook);

              searchResults.innerHTML = '';
              searchInput.value = '';
              searchInput.focus();
            })
            .catch(error => {
              console.error(error);
            });
        });

        searchResults.append(resultItem);
      });
    })
    .catch(error => {
      console.error(error);
    });
}

/**
 * FETCH BOOKS
 * fetches books from the database and creates a card for each book
 */

fetchBooks().then(books => {
  books.forEach(book => {
    createBookCard(book);
  });
});




