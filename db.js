/**
 * IMPORT
 */
import { createClient } from "@supabase/supabase-js";

// -------------------------
// ---- MAIN PROGRAM

/**
 * SUPABASE CONNECT
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * INSERT BOOKS
 * inserts a book into the database
 * @param {Object} book - book to insert
 */
export async function insertBook(book) {
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select();

  if (error) {
    throw error;
  }

  return data[0];
}

/**
 * FETCH BOOKS
 * Fetches all books from the database.
 *
 * @returns {Array} Books from the database.
 */
export async function fetchBooks() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*');

  if (error) {
    throw error;
  }

  return books;
}

/**
 * DELETE BOOK
 * @param {Number} id
 * @returns {Boolean}
 */
export async function deleteBook(id) {
  if (!id) return;

  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
  }

  return true;
}

