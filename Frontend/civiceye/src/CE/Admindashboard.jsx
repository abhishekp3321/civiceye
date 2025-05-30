import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import celogofull from '../assets/celogofull.png';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Admindashboard = () => {

  const navigate = useNavigate();
  const userid = localStorage.getItem('id');

  const [loggedUserData, setLoggedUserData] = useState({});
  const [stats, setStats] = useState({
    totalcomplaints: 0,
    statuscount: {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
      Resolved: 0,
    },
    categorystatus: {
      'Waste Dumping': 0,
      'Public Nuisance': 0,
      'Traffic Violations': 0,
      'Water Leakage': 0,
      'Power Outage': 0,
      'Noise Complaints': 0,
      'Road Damage': 0,
      Others: 0,
    },
    last7dayscount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const STATUS_COLORS = {
    Pending: '#FFB74D',
    Approved: '#4CAF50',
    Rejected: '#F44336',
    Resolved: '#2196F3'
  };

  const CATEGORY_COLORS = [
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d',
    '#a4de6c', '#d0ed57', '#ffc658', '#ff8042'
  ];

  const fetchLoggedUserData = async () => {
    try {
      if (!userid) {
        toast.error("Please login to continue");
        navigate('/login');
        return;
      }

      const response = await axios.get(`${BASE_URL}/user/view/${userid}`);
      if (response.data) {
        setLoggedUserData(response.data);


        if (response.data.role !== 'admin') {  // More explicit check
          toast.error("You are not authorized to view this page");
          navigate('/reghome');
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error("Error loading user data");
    }
  };



  const fetchComplaintsData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/proof/data`);
      console.log('API Response:', response.data);

      if (response.data) {
        // Ensure all expected categories are present
        const defaultCategories = {
          'Waste Dumping': 0,
          'Public Nuisance': 0,
          'Traffic Violations': 0,
          'Water Leakage': 0,
          'Power Outage': 0,
          'Noise Complaints': 0,
          'Road Damage': 0,
          Others: 0,
        };

        const updatedStats = {
          totalcomplaints: response.data.totalcomplaints || 0,
          statuscount: {
            Pending: response.data.statuscount?.Pending || 0,
            Approved: response.data.statuscount?.Approved || 0,
            Rejected: response.data.statuscount?.Rejected || 0,
            Resolved: response.data.statuscount?.Resolved || 0
          },
          categorystatus: {
            ...defaultCategories,
            ...(response.data.categorystatus || {})
          },
          last7dayscount: response.data.last7dayscount || 0
        };
        setStats(updatedStats);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error("Error loading complaints data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      await fetchLoggedUserData();
      await fetchComplaintsData();
    };
    initializeDashboard();
  }, [fetchLoggedUserData, fetchComplaintsData]);

  const handleLogout = () => {
    localStorage.removeItem('id');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const statusData = Object.entries(stats.statuscount)
    .filter(([_, value]) => value > 0)  // Filter out zero values
    .map(([key, value]) => ({
      name: key,
      value: value
    }));

  const categoryData = Object.entries(stats.categorystatus)
    .filter(([_, value]) => value > 0)  // Filter out zero values
    .map(([key, value]) => ({
      name: key,
      value: value
    }));

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <aside className="bg-gray-800 w-64 p-6 flex flex-col shadow-md">
        <div className="flex justify-center mb-10">
          <img src={celogofull} alt="Logo" className="w-48" />
        </div>
        <nav className="space-y-3 flex-grow">
          <button className="flex items-center w-full p-3 bg-blue-500 text-white rounded-lg">
            📊 Overview
          </button>
          <button onClick={() => navigate('/admincom')} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
            ⚖️ Complaints
          </button>
          <button onClick={() => navigate('/admin')} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
            👤 User Management
          </button>
          <button onClick={() => navigate("/feedback")} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors">
            📄 Reports
          </button>
        </nav>
        <button onClick={handleLogout} className="w-full p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
          📤 Logout
        </button>
      </aside>

      <div className="flex-1 p-6 overflow-auto">
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform hover:scale-105">
            <span className="text-gray-400">Total Complaints</span>
            <div className="text-3xl font-bold">{stats.totalcomplaints}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform hover:scale-105 border-l-4 border-yellow-500">
            <span className="text-gray-400">Pending</span>
            <div className="text-3xl font-bold">{stats.statuscount.Pending}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform hover:scale-105 border-l-4 border-green-500">
            <span className="text-gray-400">Approved</span>
            <div className="text-3xl font-bold">{stats.statuscount.Approved}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform hover:scale-105 border-l-4 border-blue-500">
            <span className="text-gray-400">Resolved</span>
            <div className="text-3xl font-bold">{stats.statuscount.Resolved}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-6">Status Overview</h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={STATUS_COLORS[entry.name] || '#777777'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} complaints`, 'Count']}
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No status data available
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-6">Category Overview</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={0}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    formatter={(value) => [`${value} complaints`, 'Count']}
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-blue-300">Complaint Categories Breakdown</h3>
          {categoryData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-lg">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300">Category</th>
                    <th className="py-3 px-4 text-left text-gray-300">Count</th>
                    <th className="py-3 px-4 text-left text-gray-300">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((category, index) => (
                    <tr key={index} className="hover:bg-gray-600 transition-colors">
                      <td className="py-3 px-4 border-b border-gray-600">{category.name}</td>
                      <td className="py-3 px-4 border-b border-gray-600">{category.value}</td>
                      <td className="py-3 px-4 border-b border-gray-600">
                        <div className="flex items-center">
                          <span className="mr-2">
                            {stats.totalcomplaints > 0
                              ? ((category.value / stats.totalcomplaints) * 100).toFixed(1)
                              : "0"}%
                          </span>
                          <div className="w-24 bg-gray-500 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full"
                              style={{
                                width: stats.totalcomplaints > 0
                                  ? `${((category.value / stats.totalcomplaints) * 100).toFixed(1)}%`
                                  : "0%",
                                backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No category data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admindashboard;