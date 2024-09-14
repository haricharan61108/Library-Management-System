import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/UserComponents/Navbar";

const MyCollection = () => {
    const [requests, setRequests] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fines, setFines] = useState([]);
    const [isRequestClicked, setIsRequestClicked] = useState(false);
    const [isCollectionClicked, setIsCollectionClicked] = useState(true);
    const [isFinesClicked, setIsFinesClicked] = useState(false);

    const fetchCollections = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`/api/user/collections/${userId}`);
            setCollections(response.data);
            setIsCollectionClicked(true);
            setIsRequestClicked(false);
            setIsFinesClicked(false);
        } catch (error) {
            console.error(`Error fetching collections: ${error}`);
        }
    }

    const fetchRequests = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`/api/user/requests/${userId}`);
            setRequests(response.data);
            setIsRequestClicked(true);
            setIsCollectionClicked(false);
            setIsFinesClicked(false);
        } catch (error) {
            console.error(`Error fetching requests: ${error}`);
        }
    }

    const fetchFines = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`/api/user/fines/${userId}`);
            setFines(response.data);
            setIsFinesClicked(true);
            setIsRequestClicked(false);
            setIsCollectionClicked(false);
        } catch (error) {
            console.error(`Error fetching fines: ${error}`);
        }
    }

    useEffect(() => {
        fetchCollections();
    }, []);

    const deleteRequest = async (id) => {
        if (window.confirm("Are you sure you want to delete this request?")) {
            try {
                await axios.delete(`/api/user/requests/${id}`);
                fetchRequests();
            } catch (error) {
                console.error(`Error deleting request: ${error}`);
            }
        }
    };

    const returnBook = async (id) => {
        if (window.confirm("Are you sure you want to return the book?")) {
            try {
                await axios.post(`/api/user/return/${id}`);
                fetchCollections();
            } catch (error) {
                console.error(`Error returning book: ${error}`);
            }
        }
    }

    return (
        <div className="bg-yellow-50 min-h-screen pb-10">
            <Navbar />
            <div className="flex justify-evenly items-center w-full pb-6">
                <button
                    onClick={fetchRequests}
                    className={`${isRequestClicked ? 'bg-blue-600 text-white' : 'bg-white'} px-6 py-4 rounded-md shadow-md`}
                >
                    My Requests
                </button>
                <button
                    onClick={fetchCollections}
                    className={`${isCollectionClicked ? 'bg-blue-600 text-white' : 'bg-white'} px-6 py-4 rounded-md shadow-md`}
                >
                    My Collections
                </button>
                <button
                    onClick={fetchFines}
                    className={`${isFinesClicked ? 'bg-blue-600 text-white' : 'bg-white'} px-6 py-4 rounded-md shadow-md`}
                >
                    My Fines
                </button>
            </div>
            <hr style={{ width: "80%", height: "1px", backgroundColor: "#000", margin: "20px auto" }} />

            {isCollectionClicked && (
                <div className="flex flex-wrap justify-center w-100">
                    {collections.map((book) => (
                        <div key={book.borrow_id || book.book_id} className="bg-white rounded shadow-md m-4 p-4"> {/* Added book_id fallback */}
                            <p>Book Name: {book.title}</p>
                            <p>Author Name: {book.author}</p>
                            <p>Borrow Date: {new Date(book.borrow_date).toLocaleDateString()}</p>
                            <p>Due Date: {new Date(book.due_date).toLocaleDateString()}</p>
                            {book.return_date && (
                                <p>Return Date: {new Date(book.return_date).toLocaleDateString()}</p>
                            )}
                            {book.fine && (
                                <p>Fine: ${book.fine.toFixed(2)}</p>
                            )}
                            {!book.return_date && (
                                <button
                                    onClick={() => returnBook(book.borrow_id || book.book_id)} 
                                    className="bg-green-600 hover:bg-green-500 px-4 py-2 mt-6 text-white rounded"
                                >
                                    Return Book
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isRequestClicked && (
                <div className="flex flex-wrap justify-center w-100">
                    {requests.map((request) => (
                        <div key={request.request_id} className="bg-white rounded shadow-md m-4 p-4">
                            <p>Book Name: {request.book.title}</p>
                            <p>Author Name: {request.book.author}</p>
                            <p>Status: {request.status}</p>
                            <button
                                onClick={() => deleteRequest(request.request_id)}
                                className="bg-red-600 hover:bg-red-500 px-4 py-2 mt-6 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isFinesClicked && (
                <div className="flex flex-wrap justify-center w-100">
                    {fines.map((fine) => (
                        <div key={fine.id} className="bg-white rounded shadow-md m-4 p-4">
                            <p>Book Name: {fine.book.title}</p>
                            <p>Author Name: {fine.book.author}</p>
                            <p>Borrow Date: {new Date(fine.borrow_date).toLocaleDateString()}</p>
                            <p>Return Date: {new Date(fine.return_date).toLocaleDateString()}</p>
                            <p>Fine: ${fine.fine.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyCollection;
