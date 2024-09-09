import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/UserComponents/Navbar";

const MyCollection = () => {
    const [requests, setRequests] = useState([]);
    const [collections, setCollections] = useState([]);
    const [isRequestClicked, setIsRequestClicked] = useState(false);
    const [isCollectionClicked, setIsCollectionClicked] = useState(true);

    const fetchCollections = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`/api/user/collections/${userId}`);
            setCollections(response.data);
            setIsCollectionClicked(true);
            setIsRequestClicked(false);
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
        } catch (error) {
            console.error(`Error fetching requests: ${error}`);
        }
    }

    useEffect(() => {
        fetchCollections();
    }, []);

    const deleteRequest = async (id) => {
        if (window.confirm("Are you sure you want to delete this request?")) {
            try {
                await axios.delete(`/api/user/requests/${id}`);
                fetchRequests(); // Refresh requests after deletion
            } catch (error) {
                console.error(`Error deleting request: ${error}`);
            }
        }
    };

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
            </div>
            <hr style={{ width: "80%", height: "1px", backgroundColor: "#000", margin: "20px auto" }} />

            {isCollectionClicked && (
                <div className="flex flex-wrap justify-center w-100">
                    {collections.map((book) => (
                        <div key={book.book_id} className="bg-white rounded shadow-md m-4 p-4">
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
                        </div>
                    ))}
                </div>
            )}

            {isRequestClicked && (
                <div className="flex flex-wrap justify-center w-100">
                    {requests.map((book) => (
                        <div key={book.book.book_id} className="bg-white rounded shadow-md m-4 p-4">
                            <p>Book Name: {book.book.title}</p>
                            <p>Author Name: {book.book.author}</p>
                            <p>Status: {book.status}</p>
                            <button onClick={() => deleteRequest(book.request_id)} className="bg-red-600 hover:bg-red-500 px-4 py-2 mt-6 text-white rounded">Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyCollection;
