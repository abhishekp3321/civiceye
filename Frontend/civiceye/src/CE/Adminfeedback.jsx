import React, { useState, useEffect } from 'react';
import celogofull from '../assets/celogofull.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Adminfeedback = () => {
    const navigate = useNavigate();
      const [isLoading, setIsLoading] = useState(true);
       
    const [feedback, setFeedback] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [statusUpdates, setStatusUpdates] = useState({}); // Store individual status updates

    const handleChange = (id, status) => {
        setStatusUpdates((prev) => ({
            ...prev,
            [id]: status,
        }));
    };

    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(`http://127.0.0.1:6262/feedback/update/${id}`, { status: statusUpdates[id] || "Pending" });
            if (response.data) {
                setFeedback(feedback.map(fb => fb._id === id ? { ...fb, status: statusUpdates[id] } : fb));
            }
        } catch (error) {
            console.error('Error updating feedback:', error);
        } finally {
            setUpdateLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:6262/feedback/get");
                if (response.data && Array.isArray(response.data.feedbacks)) {
                    setFeedback(response.data.feedbacks);
                    setIsLoading(false);
                } else {
                    console.error("Invalid feedback data:", response.data);
                    setFeedback([]);
                }
            } catch (error) {
                console.error("Error fetching feedback:", error);
                setFeedback([]);
            }
        };
        fetchData();
    }, []);
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center text-gray-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading...</p>
                    </div>
            </div>
        );
    }

    return (
        <div className="flex w-full h-screen bg-gray-900 text-white">
            <aside className="bg-gray-800 w-78 p-6 flex flex-col shadow-md">
                <div className="flex justify-center mb-10">
                    <img src={celogofull} alt="Logo" className="w-48" />
                </div>
                <nav className="space-y-3 flex-grow">
                    <button onClick={() => navigate('/dash')} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        📊 Overview
                    </button>
                    <button onClick={() => navigate("/admincom")} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        ⚖️ Complaints
                    </button>
                    <button onClick={() => navigate("/admin")} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
                        👤 User Management
                    </button>
                    <button onClick={() => navigate("/feedback")} className="flex items-center w-full p-3 bg-blue-500 text-white rounded-lg">
                        📄 Reports
                    </button>
                </nav>
                <div className="mt-auto">
                    <button onClick={() => navigate('/login')} className="w-full p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                        📤 Logout
                    </button>
                </div>
            </aside>

            <div className="rounded-lg w-full px-12 m-20">
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full bg-gray-700 rounded-lg">
                        <thead className="bg-gray-700 shadow-xl">
                            <tr>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedback.map((fb) => (
                                <tr key={fb._id} className="bg-gray-800">
                                    <td className="px-6 py-3 text-l text-gray-300">{fb.username}</td>
                                    <td className="px-6 py-3 text-l text-gray-300">{fb.email}</td>
                                    <td className="px-6 py-3 text-l text-gray-300">{fb.description}</td>
                                    <td className="px-6 py-3 text-l text-gray-300">
                                        {fb.timestamp ? new Date(fb.timestamp).toLocaleString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-3 text-l text-gray-300">{fb.status}</td>
                                    <td className="px-6 py-3">
                                        <select
                                            className="bg-gray-700 text-white p-2 rounded"
                                            value={statusUpdates[fb._id] || fb.status}
                                            onChange={(e) => handleChange(fb._id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Approved">Approved</option>
                                        </select>
                                        <button
                                            onClick={() => handleUpdate(fb._id)}
                                            className="ml-2 px-3 py-1.5 bg-blue-600 hover:bg-gray-500 rounded-lg"
                                            disabled={updateLoading}
                                        >
                                            {updateLoading ? "Updating..." : "Submit"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Adminfeedback;
