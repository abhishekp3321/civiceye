import React, { useEffect, useState } from "react";
import celogofull from '../assets/celogofull.png';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const Adminuserlist = () => {
     const [isLoading, setIsLoading] = useState(true);
   
    const [loggedUserData, setLoggedUserData] = useState({}); // Loggedin user data
    const [users, setUsers] = useState([]); // All users data list
    const userid = localStorage.getItem('id'); // Get userId from localStorage
    const navigate = useNavigate(); // Initialize useNavigate

    const fetchLoggedUserData = async () => {
        try {
            if (!userid) return;
            const response = await axios.get(`${BASE_URL}/user/view/${userid}`);

            if (response) {
                setLoggedUserData(response.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserData = async () => {
        try {
            if (!userid) return;
            const response = await axios.get(`${BASE_URL}/user/viewall/${userid}`);
            setIsLoading(false);
            if (response && response.data && response.data.users) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchLoggedUserData();
        fetchUserData();
    }, [userid]); // Add userId as a dependency

    useEffect(() => {
        if (loggedUserData.role === 'user') {
            toast.error("You are not authorized to view this page.");
        }
    }, [loggedUserData, navigate]); // Add navigate as a dependency
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
                                   <button onClick={() => navigate('/admincom')} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                    ⚖️ Complaints    
                                   </button>
                                   <button className="flex items-center w-full p-3 bg-blue-500 text-white rounded-lg">
                                       👤 User Management
                                   </button>
                                   <button onClick={() => navigate("/feedback")} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
                                       📄 Reports
                                   </button>
                               </nav>
                               <div className="mt-auto">
                                   <button onClick={() => navigate('/login')} className="w-full p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                                   📤Logout


                                   </button>
                               </div>
                           </aside>

            <div className="rounded-lg w-full p-x-12  m-20">
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full bg-gray-700 rounded-lg">
                        <thead className="bg-gray-700 shadow-xl ">
                            <tr>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">DOB</th>
                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-300 uppercase tracking-wider">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} >
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-800 text-l text-gray-300">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-800 text-l text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-800 text-l text-gray-300">{user.number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-800 text-l text-gray-300">{user.dob}</td>
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-800 text-l text-gray-300">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};