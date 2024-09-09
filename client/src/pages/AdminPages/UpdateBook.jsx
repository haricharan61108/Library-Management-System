import React, { useState } from "react";
import axios from "axios";

const UpdateBook = ({ book, onClose, onBookUpdated }) => {
    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [copiesAvailable, setCopiesAvailable] = useState(book.copies_available);
    const [totalCopies, setTotalCopies] = useState(book.total_copies);

    const handleUpdate = async () => {
        try {
            await axios.put(`/api/admin/books/${book.book_id}`, {
                title,
                author,
                copies_available: parseInt(copiesAvailable),
                total_copies:parseInt(totalCopies),
            });
            onBookUpdated();
            window.location.reload();
        } catch (error) {
            console.error("Error updating book:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded p-4 shadow-lg">
                <h2 className="text-xl mb-4">Update Book</h2>
                <form>
                    <div className="mb-4">
                        <label className="block mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Author</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Available Copies</label>
                        <input
                            type="number"
                            value={copiesAvailable}
                            onChange={(e) => setCopiesAvailable(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Total Copies</label>
                        <input
                            type="number"
                            value={totalCopies}
                            onChange={(e) => setTotalCopies(e.target.value)}
                            className="border p-2 w-full"
                        />
                    </div>
                </form>
                <button
                    onClick={handleUpdate}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                    Update
                </button>
                <button
                    onClick={onClose}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default UpdateBook;
