import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const CEUserProfile = () => {
    const navigate = useNavigate();
    const [popup, setPopup] = useState(false);
     const [isLoading, setIsLoading] = useState(true);
         

    const formDataState = {
        username: "",
        number: "",
        email: "",
        dob: "",
        address:""
       
    };

    const [formData, setFormData] = useState(formDataState);
    const userid = localStorage.getItem("id");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await axios.put(
                `${BASE_URL}/user/update/${userid}`,
                formData
            );
     
            console.log("User updated successfully!", response.data);
            setPopup(true);
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };
  const handleexit = () => {
    navigate("/reghome");
  };

    const fetchData = async () => {
        if (!userid) return;
        try {
            const response = await axios.get(
                `${BASE_URL}/user/view/${userid}`
            );
            if (response.data) {
                setFormData({
                    username: response.data.username || "",
                    number: response.data.number || "",
                    email: response.data.email || "",
                    dob: response.data.dob || "",
                    address:response.data.address||""   
                     
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userid]);
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
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-[80%] max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center">
                    <span className="mr-2">📹</span>
                    <span className="text-gray-300">Civic</span>
                    <span className="text-blue-500">EYE</span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <input
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-700 rounded-md bg-gray-700 text-white"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-300">
                                Mobile Number
                            </label>
                            <input
                                name="number"
                                type="tel"
                                value={formData.number}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-700 rounded-md bg-gray-700 text-white"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-300">
                                Email ID
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-700 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                        
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-300">
                            Address
                                </label>
                            <input
                                name="address"
                                type="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-700 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-300">
                                D.O.B
                            </label>
                            <input
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-700 rounded-md bg-gray-700 text-white"
                            />
                        </div>

                
                    </div>

                    {popup && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/80">
                            <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl max-w-3xl w-full">
                                <button
                                    onClick={() => setPopup(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                                >
                                    ✖
                                </button>
                                <ProfileUpdatedPopup onClose={() => setPopup(false)} />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between gap-4 mt-6">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600"
                            onClick={handleexit}
                        >
                            HOME
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600"
                        >
                            SUBMIT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Fixed the missing ProfileUpdatedPopup component
const ProfileUpdatedPopup = ({ onClose }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white text-center">
            <h2 className="text-xl font-semibold mb-4">Profile Updated!</h2>
            <p>Your profile has been successfully updated.</p>
            <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
            >
                Close
            </button>
        </div>
    );
};

export default CEUserProfile;
