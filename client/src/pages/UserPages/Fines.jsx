import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/UserComponents/Navbar";

const Fines = () => {
  const [fines, setFines] = useState([]);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`/api/user/fines/${userId}`);
        setFines(response.data);
      } catch (error) {
        console.error(`Error fetching fines: ${error}`);
      }
    };

    fetchFines();
  }, []);

  return (
    <div className="bg-yellow-50 min-h-screen pb-10">
      <Navbar />
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
    </div>
  );
}

export default Fines;
