import React, { useState } from 'react'
import celogofull from '../assets/celogofull.png'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';

export const CELogin = () => {      
    const [data, setdata] = useState('');
    const Navigate = useNavigate();
    const token = localStorage.getItem("token");
    const change = (event) => {
        setdata({ ...data, [event.target.name]: event.target.value });
    };
console.log(token);

    const submit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:6262/user/signin', data);
            if (response.data) {
                console.log(response.data);
                localStorage.setItem('id', response.data.userId);
                localStorage.setItem('token', response.data.token);
                if (response.data.role === 'admin') {
                    Navigate('/dash');
                } else if (response.data.role === 'user') {
                    Navigate('/reghome');
                }
            }
        } catch (error) {   
            console.log(error);
        }
    };
   

    return (
        <div className="relative flex justify-center items-center h-screen px-10 bg-gray-900 text-white">
            {/* the box  */}
            <div className="bg-gray-800 flex flex-col md:flex-row w-7xl shadow-lg rounded-lg py-10 px-4 md:py-20 md:px-0">
                {/* Left Section */}
                <div className="w-full md:w-1/2 flex flex-col justify-between items-center p-8 border-b-2 md:border-b-0 md:border-r-2 border-gray-700">
                    <img width="200px" src={celogofull} alt="Civic Eye Logo" />
                    <p className="text-white text-center text-xl">
                        Welcome to CivicEye!
                    </p>
                    <div className='mb-4'>
                        <p className=" text-white text-center text-lg">
                            Your platform to report, track,
                        </p>
                        <p className="text-white text-center text-lg">
                            and resolve public issues with ease.
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-1/2 flex flex-col items-center p-8">
                    <h2 className="text-4xl font-semibold text-gray-300 mb-6">SIGN <span className='text-[#00B9FF]'>IN</span></h2>
                    <form className="w-full max-w-sm" onSubmit={submit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-100 text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                onChange={change}
                                id="email"
                                name='email'
                                type="email"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 placeholder-gray-500 focus:outline-gray-500 active:outline-gray-500 active:shadow-lg text-white"
                                placeholder="Email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-100 text-sm font-medium mb-2 focus:">
                                Password
                            </label>
                            <input
                                onChange={change}
                                id="password"
                                name='password'
                                type="password"
                                className="bg-gray-700 w-full px-4 py-2 border border-gray-700 rounded-lg placeholder-gray-500 text-white"
                                placeholder="Password"
                            />
                        </div>
                        {/* <div className="flex justify-between items-center mb-6">
                            <a href="#" className="text-sm text-[#00B9FF] hover:underline ml-auto">
                                Forgot Password?
                            </a>
                        </div> */}
                        <button
                            type="submit"
                            className="w-full bg-[#00B9FF] text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            SIGN IN
                        </button>
                    </form>
                    <p className="text-gray-400 text-sm mt-4">
                        Don't Have an Account?{' '}
                        <Link to="/signup" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};