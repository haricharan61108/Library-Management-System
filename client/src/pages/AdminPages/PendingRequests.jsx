import React,{useEffect,useState} from "react";
import axios from "axios";
import Navbar from "../../components/UserComponents/Navbar";

const PendingRequests=({role})=> {
    const [pendingRequests,setPendingRequests]=useState([]);
    useEffect(()=> {
        const fetchPendingRequests=async()=> {
            try {
                const response=await axios.get('/api/admin/pendingRequests');
                setPendingRequests(response.data);
            } catch (error) {
                console.error("error fetching pending requests:",error);
            }
        }
        fetchPendingRequests();
    },[]);

    const handleAccept=async(request)=> {
        try {
            const {request_id,user_id,book_id}=request;
            await axios.post("/api/admin/acceptRequest",{id:request_id,userId:user_id,bookId:book_id});
            setPendingRequests(pendingRequests.filter(r=>r.request_id!==request_id));
        } catch (error) {
            console.error("error accepting request",error);
        }
    }
    const handleReject=async(requestId)=> {
        try {
            await axios.post("/api/admin/rejectRequest",{requestId});
            setPendingRequests(pendingRequests=>pendingRequests.filter(request=>request.request_id!==requestId));

        } catch (error) {
            console.error("error Rejecting request",error);
        }
    }
    return (
        <>
        <div className="bg-slate-300 min-h-screen pb-10">
                <Navbar role={role} />
                <div className="flex-wrap flex w-100">
                    {pendingRequests.map((request) => (
                        <div key={request.id} className="bg-white rounded shadow-md m-4 p-4">
                            <p>Book Title: {request.Book.title}</p>
                            <p>Author: {request.Book.author}</p>
                            <p>Requested by: {request.User.username}</p>
                            <p>Request Date: {new Date(request.request_date).toLocaleDateString()}</p>
                            <p>Status: {request.status}</p>
                            <div className="flex space-x-4 mt-4">
                               <button
                                 onClick={()=>handleAccept(request)}
                                className="bg-green-500 text-white px-4 py-2 rounded">Accept Request</button>
                               <button 
                                  onClick={()=>handleReject(request.request_id)}
                               className="bg-red-500 text-white px-4 py-2 rounded">Reject Request</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default PendingRequests;