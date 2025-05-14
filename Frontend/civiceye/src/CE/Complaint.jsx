import React, { useState } from "react";
import {   useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const Complaint = () => {
  

  const userid = localStorage.getItem("id");
  const navigate = useNavigate();

  const [add, setAdd] = useState({
    description: "",
    complaint: "",
    location: "",
    proof: null,
    createdAt: new Date().toISOString(),
  });

  const comChange = (e) => {
    setAdd({ ...add, [e.target.name]: e.target.value });
  };

  const comFile = (e) => {
    setAdd({ ...add, proof: e.target.files[0] });
  };

  const comSubmit = async (e) => {
    e.preventDefault();
    if (!userid) {
      toast.error("Please login to submit a complaint");
      return;
    }

    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("description", add.description);
    formData.append("complaint", add.complaint);
    formData.append("location", add.location);
    formData.append("createdAt", add.createdAt);

    if (add.proof) {
      formData.append("proof", add.proof);
    }

    try {
      console.log(formData);

    const response = await axios.post('http://127.0.0.1:6262/proof/add', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

      console.log(response.data);
      toast.success("Complaint registered successfully");

      setAdd({
        description: "",
        complaint: "",
        location: "",
        proof: null
      });

      navigate('/reghome');
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error(error.response?.data?.message || "Failed to register complaint");
    }
  };
  
  const handelcancel = () => {
 
      navigate('/reghome')
     
  };

  return (
    <div className="flex items-center justify-center  bg-gray-900 text-white">
      <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center">Report Issues Seamlessly</h1>
        <p className="mt-2 text-center text-gray-400">
          Our platform empowers users to submit complaints with ease, offering tools to upload multimedia for comprehensive issue reporting.
        </p>
        <form className="mt-6" onSubmit={comSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <input
              type="text"
              name="description"
              value={add.description}
              onChange={comChange}
              className="w-full px-4 py-2 mt-1 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Complaint type</label>
            <select
              name="complaint"
              value={add.complaint}
              onChange={comChange}
              className="w-full px-4 py-2 mt-1 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-700 text-white"
              required
            >
              <option value="">Select complaint type</option>
              <option value="Waste Dumping">Waste Dumping</option>
              <option value="Public Nuisance">Public Nuisance</option>
              <option value="Traffic Violations">Traffic Violations</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="Power Outage">Power Outage</option>
              <option value="Noise Complaint">Noise Complaint</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Location</label>
            <input
              type="text"
              name="location"
              value={add.location}
              onChange={comChange}
              className="w-full px-4 py-2 mt-1 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Proof</label>
            <input
              type="file"
              id="proof-file"
              onChange={comFile}
              className="hidden"
              accept="image/*,video/*"
            />
            <label
              htmlFor="proof-file"
              className="block w-full px-4 py-2 mt-1 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
            >
              Upload photo or video
            </label>
            {add.proof && (
              <p className="mt-2 text-sm text-gray-400">
                Selected file: {add.proof.name}
              </p>
            )}
          </div>
          <div className="flex justify-between space-x-9">
            <button 
              type="submit"
              className="w-[44%] px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Submit
            </button > 
            <button onClick={handelcancel}
              type="submit"
              className="w-[44%] px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-blue-700 focus:outline-none"
            >
cancel            </button > 
          </div>
        </form>
      </div>
    </div>
  );
};