import React, { useState, useEffect, useRef } from "react";
import celogofull from '../assets/celogofull.png';
import logout from '../assets/logout.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { use } from "react";
import male from "../assets/male.png";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;


export const Admincom = () => {
    const navigate = useNavigate();

    const [is, setIs] = useState(true);
    const [update, setUpdate] = useState(false);

    const [complaints, setComplaints] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [updatedata, setupdatedata] = useState({ status: "" });
    const [dropdown, setDropdown] = useState(false)
    const [active, setActive] = useState(null)
    const dropdownref = useRef(null)
    const userid = localStorage.getItem("id");

    useEffect(() => {
        const fetchComplaints = async () => {
            if (!userid) {
                console.error("No user ID found");
                return;
            }
            try {
                const response = await axios.get(`${BASE_URL}/proof/getall/${userid}`);
                setComplaints(response.data);
                setIs(false);


            } catch (error) {
                console.error("Error fetching complaints:", error.response?.data || error.message);
                setComplaints([]);
                toast.error("Failed to fetch complaints.");
            }
        };
        fetchComplaints();
    }, [userid]);

    const filteredComplaints = (filterStatus === "all"
        ? complaints
        : complaints.filter(com => com.status === filterStatus)
    ).slice().reverse();
    const currentItems = filteredComplaints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
    const statuschange = (event) => {
        const { name, value } = event.target;
        setupdatedata((prev) => ({ ...prev, [name]: value }));
    };

    const statussubmit = async (complaintId, event) => {
        event.preventDefault();
        if (!updatedata.status) return toast.error("Please select a status!");
        setUpdate(true);
        try {
            const response = await axios.put(`${BASE_URL}/proof/update/${complaintId}`, { status: updatedata.status });
            setComplaints(prev => prev.map(com => com._id === complaintId ? { ...com, status: updatedata.status } : com));
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error updating status:", error.response?.data || error.message);
            toast.error("Failed to update status.");
        } finally {
            setUpdate(false);
        }
    };

    const downloadProof = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("Failed to fetch file");

            const blob = await response.blob();
            if (blob.type.includes("text/html")) throw new Error("Invalid file type.");
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileUrl.split("/").pop(); // Extract filename from URL
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error down file:", error);
            toast.error("Download failed. Try again.");
        }
    };
    if (is) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center text-gray-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex w-full h-screen bg-gray-900 text-white">
            <aside className="bg-gray-800 w-64 p-6 flex flex-col shadow-md">
                <div className="flex justify-center mb-10">
                    <img src={celogofull} alt="Logo" className="w-48" />
                </div>
                <nav className="space-y-3 flex-grow">
                    <button onClick={() => navigate('/dash')} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700">📊 Overview</button>
                    <button className="flex items-center w-full p-3 bg-blue-500 text-white rounded-lg">⚖️ Complaints</button>
                    <button onClick={() => navigate('/admin')} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700">👤 User Management</button>
                    <button onClick={() => navigate("/feedback")} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700">📄 Reports</button>
                </nav>
                <button onClick={() => navigate('/')} className="w-full p-3 bg-gray-700 rounded-md hover:bg-gray-600">📤 Logout</button>
            </aside>

            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
                    <select className="p-2 border rounded-md bg-gray-700 text-white" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>

                    </select>
                    <button onClick={() => navigate('/login')} className="flex items-center space-x-2 mt-4 md:mt-0">
                        <img src={logout} alt="Logout" className="w-8 h-8" />
                    </button>
                </div>

                {filteredComplaints.length === 0 ? (
                    <div className="text-center">...</div>
                ) : (
                    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-lg font-medium text-gray-300 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-lg font-medium text-gray-300 uppercase">Description</th>
                                    <th className="px-4 py-3 text-left text-lg font-medium text-gray-300 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-lg font-medium text-gray-300 uppercase">Location</th>
                                    <th className="px-4 py-3 text-left text-lg font-medium text-gray-300 uppercase">Category</th>
                                    <th className="px-4 py-3 text-center text-lg font-medium text-gray-300 uppercase">Proof</th>
                                    <th className="px-4 py-3 text-center text-lg font-medium text-gray-300 uppercase">Download</th>
                                    <th className="px-4 py-3 text-center text-lg font-medium text-gray-300 uppercase">Change Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {currentItems.map((com) => (
                                    <tr key={com._id} className="hover:bg-gray-700">
                                        <td className="px-4 py-4 text-sm text-gray-300">{new Date(com.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-sm text-gray-300">{com.description}</td>
                                        <td className="px-4 py-4 text-sm text-gray-300">{com.status}</td>
                                        <td className="px-4 py-4 text-sm text-gray-300">{com.location}</td>
                                        <td className="px-4 py-4 text-sm text-gray-300">{com.complaint}</td>
                                        <td className="px-4 py-4 text-center text-sm">
                                            {com.proof ? <a href={`http://127.0.0.1:6262/${com.proof}`} target="_blank" rel="noopener noreferrer">View Proof</a> : "No Proof"}
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm">

                                            {com.proof ? (
                                                <button onClick={() => downloadProof(`http://127.0.0.1:6262/${com.proof}`)} className="inline-flex justify-center items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" disabled={!com.proof}>
                                                    Download
                                                </button>
                                            ) : "No Proof"}
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm">
  <div className="relative inline-block text-left">
    <button
      onClick={() => {
        // Toggle dropdown and set active complaint
        if (active === com._id) {
          setDropdown(!dropdown);
        } else {
          setActive(com._id);
          setDropdown(true);
        }
      }}
      className="inline-flex justify-center items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    >
      Update
    </button>

    {dropdown && active === com._id && (
      <>
        {/* Overlay for closing dropdown on outside click */}
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdown(false);
            setActive(null);
          }}
        ></div>

        {/* Dropdown form */}
        <form
          onSubmit={(event) => statussubmit(com._id, event)}
          className="absolute z-50 mt-2 right-0 bg-gray-800 rounded-lg shadow-md p-4 w-64"
        >
          <select
            id="status"
            name="status"
            className="p-2 border rounded-md bg-gray-700 text-white mb-2 w-full"
            value={updatedata.status}
            onChange={statuschange}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            type="submit"
            className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${update ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={update}
          >
            {update ? "Updating..." : "Update"}
          </button>
        </form>
      </>
    )}
  </div>
</td>
                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>
                )}
                {filteredComplaints.length > itemsPerPage && (
                    <div className="flex justify-center mt-4  bottom-0">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 mx-1 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50">Previous</button>
                        <span>{currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 mx-1 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50">Next</button>
                    </div>
                )}
            </main>
        </div>
    );
};