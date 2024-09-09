import React, { useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/UserComponents/Navbar';

function AddBook({ role }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [copiesAvailable, setCopiesAvailable] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [addedDate, setAddedDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/auth/admin/addBooks', {
        title,
        author,
        copies_available: parseInt(copiesAvailable),
        total_copies: parseInt(totalCopies),
        added_date: new Date(addedDate),
      });
      setMessage('Book added succesfully');
      setTitle('');
      setAuthor('');
      setCopiesAvailable('');
      setTotalCopies('');
      setAddedDate('');
    } catch (error) {
      console.error('error adding book: ', error);
      setMessage("failed to add book,plz try again");
    }
  }
  return (
    <div>
      <Navbar role={role} />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Copies Available</label>
            <input
              type="number"
              value={copiesAvailable}
              onChange={(e) => setCopiesAvailable(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Copies</label>
            <input
              type="number"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Added Date</label>
            <input
              type="date"
              value={addedDate}
              onChange={(e) => setAddedDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddBook