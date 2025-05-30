import React, { useState } from "react";
import celogofull from '../assets/celogofull.png';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const Signup = () => {
    const [data, setdata] = useState({});
    const Navigate = useNavigate();
           

    const change = (event) => {
        setdata({ ...data, [event.target.name]: event.target.value });
    };

    const submit = async (event) => {
        event.preventDefault();
        console.log("Submitting Data:", data);
        try {
            const response = await axios.post(`${BASE_URL}/user/signup`, data);
            if (response.data) {
                console.log("Signup Response:", response);
                localStorage.setItem('id', response.data.userId);
                localStorage.setItem('token', response.data.token);
                alert('login Succesful');
                Navigate('/reghome');
            } else {
                alert('invalid respones from server');
            }
        } catch (error) {
            console.error("Signup Error:", error.response?.data || error.message);
        }
    };
  

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 px-10 text-white">
            <div className="bg-gray-800 flex flex-col md:flex-row w-7xl shadow-lg rounded-lg py-10 px-4 md:py-10 md:px-0">
                {/* Left Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-between items-center p-8 border-b-2 md:border-b-0 md:border-r-2 border-gray-700">
                    <img width="200px" src={celogofull} alt="Civic Eye Logo" />
                    <p className="text-gray-100 text-center text-xl">Welcome to CivicEye!</p>
                    <div className='mb-4'>
                        <p className="text-gray-100 text-center text-lg">Your platform to report, track,</p>
                        <p className="text-gray-100 text-center text-lg">and resolve public issues with ease.</p>
                    </div>
                </div>

                {/* Right Section (Signup Form) */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl items-center justify-center flex font-semibold text-gray-300 mb-6">
                        SIGN <span className="text-blue-500">UP</span>
                    </h2>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-gray-300 text-sm font-medium mb-2">
                                Username
                            </label>
                            <input
                                onChange={change}
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-blue-500 active:outline-blue-500 active:shadow-lg"
                            />
                        </div>

                        <div>
                            <label htmlFor="number" className="block text-gray-300 text-sm font-medium mb-2">
                                Mobile Number
                            </label>
                            <input
                                id="number"
                                name="number"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-blue-500 active:outline-blue-500 active:shadow-lg"
                                placeholder="Enter your mobile number"
                                onChange={change}
                            />
                        </div>

                        <div>
                            <label htmlFor="dob" className="block text-gray-300 text-sm font-medium mb-2">
                                DOB
                            </label>
                            <input
                                onChange={change}
                                id="dob"
                                name="dob"
                                type="date"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-blue-500 active:outline-blue-500 active:shadow-lg"
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => (e.target.value === "" ? (e.target.type = "text") : null)}
                                placeholder="Date of Birth"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                onChange={change}
                                id="email"
                                name="email"
                                type="email"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-blue-500 active:outline-blue-500 active:shadow-lg"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-gray-300 text-sm font-medium mb-2">
                            Address
                            </label>
                            <input
                                onChange={change}
                                id="address"
                                name="address"
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-blue-500 active:outline-blue-500 active:shadow-lg"
                            />
                        </div>


                        <div>
                            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                                Password
                            </label>
                            <input 
                                onChange={change}
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-blue-500 active:outline-blue-500 active:shadow-lg"
                            />
                        </div>

                        <button className="w-full bg-[#00B9FF] text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition">
                            SIGN UP
                        </button>
                    </form>

                    <p className="text-gray-100 text-sm text-center mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;