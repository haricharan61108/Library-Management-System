import { useNavigate } from "react-router-dom";


const Navbar = ({ role }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-gray-800 text-white h-16 flex justify-between w-full items-center px-10 mb-10">
                <h1 className="w-1/2">Book your Book</h1>
                <div className="w-full flex justify-end">
                    {role === 'admin' ? (
                        <>
                            <button onClick={() => { navigate('/admin/home') }} className="mx-2 hover:bg-gray-600 px-4 py-2 rounded">Home</button>
                            <button onClick={() => { navigate('/admin/addBook') }} className="mx-2 hover:bg-gray-600 px-4 py-2 rounded">Add Book</button>
                            <button onClick={() => { navigate('/admin/pending') }} className="mx-2 hover:bg-gray-600 px-4 py-2 rounded">Pending Requests</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => { navigate('/user/home') }} className="mx-2 hover:bg-gray-600 px-4 py-2 rounded">Home</button>
                            <button onClick={() => { navigate('/user/collection') }} className="mx-2 hover:bg-gray-600 px-4 py-2 rounded">My Collection</button>
                            <button onClick={() => { navigate('/user/profile') }} className="mx-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">Profile</button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default Navbar;