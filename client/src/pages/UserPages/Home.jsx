import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/UserComponents/Navbar";
import UpdateBook from "../AdminPages/UpdateBook";

const Home = ({ role }) => {
    const [books, setBooks] = useState([]);
    const [updateBook,setUpdateBook]=useState(null);
    const [showUpdateModal,setShowUpdateModal]=useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("/api/user/books");
                setBooks(response.data);
            } catch (error) {
                console.error(`Error fetching requests: ${error}`)
            }
        };

        fetchBooks();
    }, []);

    const addRequest = async (id) => {
        try {
            const response=await axios.post("/api/user/bookRequest", {
                bookId:parseInt(id),
                userId:parseInt(localStorage.getItem('userId'))
            }, {
                headers: {
                    'Content-Type':'application/json'
                }
            });
            if(response.status===200) {
                alert("Book Requested Succesfully");
            }
            else {
                alert("Unexpected response");
            }
        } catch (error) {
            if(error.response && error.response.status===400) {
                alert("Book Already Requested");
            }
            else {
                console.error("Error requesting book: ",error);
                alert("Failed to request book.Please try again later");
            }
        }
    }


    const handleUpdateClick=(book)=> {
        setUpdateBook(book);
        setShowUpdateModal(true);
    }

    const handleUpdateClose=()=> {
        setUpdateBook(null);
        setShowUpdateModal(false);
    }
     
    const handleDelete=async(id)=> {
        try {
            await axios.delete(`/api/admin/books/${id}`);
            setBooks(books.filter((book)=>book.book_id!==id));
        } catch (error) {
            console.error("error deleting book: ",error);
        }
    }
    return (
        <>
            <div className="bg-slate-300 min-h-screen pb-10">
                <Navbar role={role} />
                <div className="flex-wrap flex w-100">
                    {books.map((book) => (
                        <div key={book.book_id} className="bg-white rounded shadow-md m-4 p-4">
                            <p>Book Name: {book.title}</p>
                            <p>Author Name: {book.author}</p>
                            <p>Available Copies: {book.copies_available}</p>
                            {role == 'admin' ? (
                                <>
                                    <button onClick={() => handleUpdateClick(book)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 mt-6 text-white rounded">Update</button>
                                    <button onClick={() => handleDelete(book.book_id)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 mt-6 text-white rounded ml-2">Delete</button>
                                </>
                            ) : (
                                <button onClick={() => addRequest(book.book_id)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 mt-6 text-white rounded">Request Borrow</button>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center my-6">
                    <button className="bg-blue-600 mx-2 px-4 py-2 hover:bg-blue-500 text-white rounded ">Prev</button>
                    <button className="bg-blue-600 mx-2 px-4 py-2 hover:bg-blue-500 text-white rounded ">Next</button>
                </div>
            </div>
            {showUpdateModal && updateBook && (
                <UpdateBook book={updateBook} onClose={handleUpdateClose} onBookUpdated={handleUpdateClose} />
            )}
        </>
    );
};

export default Home;
