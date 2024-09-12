import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/UserComponents/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`/api/user/${userId}`);
        setUser(res.data);
      } catch (error) {
        console.error(`Error while fetching user details: ${error}`);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="bg-yellow-50 min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center pt-10">
        {user ? (
          <div className="bg-white rounded shadow-md m-4 p-6 w-80">
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Full Name:</strong> {user.fullname}</p>
            <p><strong>Joined Date:</strong> {new Date(user.registration_date).toLocaleDateString()}</p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Borrowed Books:</h3>
            {user.BorrowedBooks.length > 0 ? (
              user.BorrowedBooks.map((borrowedBook) => (
                <div key={borrowedBook.borrow_id} className="bg-gray-100 rounded p-4 mb-4">
                  <p><strong>Book Title:</strong> {borrowedBook.Book.title}</p>
                  <p><strong>Author:</strong> {borrowedBook.Book.author}</p>
                  <p><strong>Borrow Date:</strong> {new Date(borrowedBook.borrow_date).toLocaleDateString()}</p>
                  <p><strong>Due Date:</strong> {new Date(borrowedBook.due_date).toLocaleDateString()}</p>
                  {borrowedBook.return_date && (
                    <p><strong>Return Date:</strong> {new Date(borrowedBook.return_date).toLocaleDateString()}</p>
                  )}
                  {borrowedBook.fine && (
                    <p><strong>Fine:</strong> ${borrowedBook.fine.toFixed(2)}</p>
                  )}
                </div>
              ))
            ) : (
              <p>No borrowed books.</p>
            )}
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
