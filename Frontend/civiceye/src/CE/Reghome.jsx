import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Complaint } from "./Complaint";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// Import assets
import por from "../assets/porsche.jpg";
import waste from "../assets/waste.png";
import alert from "../assets/alert.png";
import traffic from "../assets/traffic.png";
import others from "../assets/others.png";
import tick from "../assets/tick.png";
import reports from "../assets/reports.png";
import prize from "../assets/prize.png";
import put from "../assets/waste.jpeg";
import mail from "../assets/mail.png";
import celogofull from "../assets/celogofull.png";
import parking from "../assets/parking.jpeg"
import male from "../assets/male.png";
import call from "../assets/call.png";
import shake from "../assets/shake.jpeg"
import axios from "axios";
import toast from "react-hot-toast";

const Profilelogout = ({ onClose }) => {
  const navigate = useNavigate();


  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-lg shadow-lg p-8 w-96">
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-100 hover:text-gray-300">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="relative w-20 h-20 mb-4">
          <div className="relative bg-white rounded-full p-3 flex items-center justify-center">
            <svg
              className="h-10 w-10 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <text x="7" y="20" fontSize="25" fontWeight="bold">
                ?
              </text>
            </svg>
          </div>
        </div>

        <p className="text-sm text-white mb-4">Are you sure you want to log out?</p>
        <div className="flex justify-between gap-10 mt-6">
          <button
            onClick={() => {
              navigate("/");
              onClose(); // Close the popup after navigating
            }}
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
          >
            Yes, Logout
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export { Profilelogout };

export const Reghome = () => {


  const [popup, setPopup] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for logout popup
  const [feedbackpop, setfeedbackpop] = useState(false);
  const [deletepopup, setdeletepopup] = useState(false)

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const contactRef = useRef(null);
  const userid = localStorage.getItem("id");
  const aboutRef = useRef(null);
  const [stats, setStats] = useState(null);
  const fetchComplaintsData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/proof/data`, {
      });
      console.log('API Response:', response.data);
      const updatedStats = {
        totalcomplaints: response.data.totalcomplaints || 0,
        statuscount: {
          Approved: response.data.statuscount?.Approved || 0,
          Resolved: response.data.statuscount?.Resolved || 0
        }
      };
      setStats(updatedStats);

    } catch (error) {
      console.error('Error fetching complaints data:', error);
    }
  };

  useEffect(() => {
    fetchComplaintsData();
  }, []);
  const deleteAccount = async () => {
    try {
      if (!userid) {
        toast.error("User ID not found.");
        return;
      }

      let response = await axios.delete(
        `${BASE_URL}/user/delete/${userid}`
      );
      console.log(response.data);

      toast.success("Account deleted successfully");
      localStorage.clear();

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log("Error deleting account:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = (e) => {
    e.preventDefault();
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  },);

  const [feedback, setfeedback] = useState({ description: "" });

  const feedbackchange = (event) => {
    setfeedback({ ...feedback, [event.target.name]: event.target.value });
  };

  const postfeedback = async (event) => {
    event.preventDefault();
    const feedbackPayload = {
      userid: userid,
      description: feedback.description,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
       ` ${BASE_URL}/feedback/post`,
        feedbackPayload
      );
      console.log(response);
      setfeedback({ description: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit feedback");
      }
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
    setDropdown(false); // Close the dropdown when logout is clicked
  };

  const closeLogoutPopup = () => {
    setShowLogoutPopup(false);
  };
  const handelfeedClick = () => {
    setfeedbackpop(true)

  }
  const handeldeletepopup = () => {
    setdeletepopup(true)
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto flex justify-between items-center h-20 px-4 sm:px-20">
          <img
            src={celogofull}
            width="200"
            height="80"
            alt="Civiceye"
            className="object-contain"
          />
          <ul className="hidden md:flex items-center space-x-10">
            <li>
              <a
                href="#"
                className="text-gray-300 font-semibold hover:text-blue-500 transition duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => navigate("/complaints")}
                className="text-gray-300 font-semibold hover:text-blue-500 transition duration-300"
              >
                My Complaints
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={scrollToAbout}
                className="text-gray-300 font-semibold hover:text-blue-500 transition duration-300"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={scrollToContact}
                className="text-gray-300 font-semibold hover:text-blue-500 transition duration-300"
              >
                Contact
              </a>
            </li>
          </ul>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdown(!dropdown)}
              className="flex cursor-pointer items-center focus:outline-none"
            >
              <img
                src={male}
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-600"
              />
            </button>

            {dropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-xl rounded-lg border border-gray-700 py-2 z-50">
                <Link to="/userprofile" onClick={() => setDropdown(false)}>
                  <button className="block cursor-pointer w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition duration-200">
                    Profile
                  </button>
                </Link>

                <button
                  className="block w-full cursor-pointer text-left px-4 py-2 text-red-500 hover:bg-gray-700 transition duration-200"
                  onClick={() => {
                    deleteAccount();
                    setDropdown(false);
                    handeldeletepopup(); // Call the function here
                  }}
                >
                  Delete Account
                </button>
                <button
                  className="block w-full cursor-pointer text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition duration-200"
                  onClick={handleLogoutClick} // Open logout popup
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {deletepopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/80">
          <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl max-w-3xl w-full">
            <button
              onClick={() => setdeletepopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <AccountDelete onClose={() => setdeletepopup(false)} />
          </div>
        </div>
      )}

      {/* Main Content - add padding top to accommodate fixed navbar */}
      <div className="pt-20">
        {/* Carousel */}
        <Carousel
          autoPlay
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          interval={5000}
          className="h-[70vh] w-[50vw] flex justify-center sm:mx-120  items-center"
        >
          <div>
            <img
              src={parking}
              alt="Civic Engagement"
              className="w-[20%] object-fill  h-[60vh]"
            />
          </div>
          <div>
            <img
              src={shake}
              alt="Community Safety"
              className="w-full object-fill h-[60vh]"
            />
          </div>
          <div>
            <img
              src={put}
              alt="Civic Responsibility"
              className="w-full object-fill h-[60vh]"
            />
          </div>
        </Carousel>

        {/* Complaint Popup */}
        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs  bg-gray-950/80 px-6">
            <div className="relative flex items-center  justify-center">
              <button
                onClick={() => setPopup(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <Complaint />
            </div>
          </div>
        )}

        {/* Logout Popup */}
        {showLogoutPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/80">
            <Profilelogout onClose={closeLogoutPopup} />
          </div>
        )}

        {/* Register Complaints Section */}
        <div className="w-full mx-auto py-16 space-y-10 px-4 sm:px-20 bg-gray-900 ">
          <div className="max-w-6xl mx-auto ">
            <h2
              className="text-3xl font-bold text-center mb-4 text-white"
              data-aos="fade-up"
            >
              Register Complaints
            </h2>
            <p
              className="text-center text-gray-400 mb-10 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Select the type of issue you'd like to report. Your vigilance helps
              keep our community safe and clean.
            </p>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 "
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <button
                onClick={() => setPopup(true)}
                className="bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-5 border-green-500"
              >
                <div className="flex justify-center mb-4 ">
                  <img src={waste} alt="Waste Dumping" className="w-16 h-16" />
                </div>
                <p className="text-white text-center font-semibold">
                  Waste Dumping
                </p>
                <p className="text-gray-400 text-center text-sm mt-2">
                  Report illegal waste disposal
                </p>
              </button>
              <button
                onClick={() => setPopup(true)}
                className="bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-5 border-red-500"
              >
                <div className="flex justify-center mb-4">
                  <img src={alert} alt="Public Nuisance" className="w-16 h-16" />
                </div>
                <p className="text-white text-center font-semibold">
                  Public Nuisance
                </p>
                <p className="text-gray-400 text-center text-sm mt-2">
                  Report disturbances and hazards
                </p>
              </button>
              <button
                onClick={() => setPopup(true)}
                className="bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-5 border-yellow-500"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={traffic}
                    alt="Traffic Violations"
                    className="w-16 h-16"
                  />
                </div>
                <p className="text-white text-center font-semibold">
                  Traffic Violations
                </p>
                <p className="text-gray-400 text-center text-sm mt-2">
                  Report unsafe driving or violations
                </p>
              </button>
              <button
                onClick={() => setPopup(true)}
                className="bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-5 border-purple-500"
              >
                <div className="flex justify-center mb-4">
                  <img src={others} alt="Others" className="w-16 h-16" />
                </div>
                <p className="text-white text-center font-semibold">Others</p>
                <p className="text-gray-400 text-center text-sm mt-2">
                  Report other community issues
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gray-900 py-16 px-4 sm:px-20" data-aos="fade-up">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-white" data-aos="fade-up">
              Impact Statistics
            </h2>
            <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto" data-aos="fade-up">
              Together we're making a difference in our communities. See the real impact of citizen reports.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center border-t-5 border-blue-500">
                <div className="flex justify-center mb-6">
                  <img src={tick} alt="Complaints Registered" className="w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Complaints Registered
                </h3>
                <div className="text-4xl font-bold text-blue-500 ">
                  {stats ? stats.totalcomplaints || 0 : 0}
                </div>
                <p className="text-gray-400 mt-2">
                  Citizen reports submitted
                </p>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center border-t-5 border-green-500">
                <div className="flex justify-center mb-6">
                  <img src={reports} alt="Reports Filed" className="w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Reports Approved
                </h3>
                <div className="text-4xl font-bold text-blue-500">
                  {stats ? stats.statuscount?.Approved || 0 : 0}
                </div>
                <p className="text-gray-400 mt-2">
                  Cases Approved by authorities
                </p>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center border-t-5 border-yellow-500">
                <div className="flex justify-center mb-6">
                  <img src={prize} alt="Rewards Distributed" className="w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Cases Resolved                </h3>
                <div className="text-4xl font-bold text-blue-500">
                  {stats ? stats.statuscount?.Resolved || 0 : 0}
                </div>
                <p className="text-gray-400 mt-2">
                  Cases  Resolved by authorities                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <section className="py-16 bg-gray-900">
          <div
            ref={aboutRef}
            id="about"
            className="max-w-8xl mx-auto px-4 sm:px-20"
            data-aos="fade-right"
          >
            <h2
              className="text-3xl font-bold text-center mb-4 text-white"
              data-aos="fade-up"
            >
              How It Works
            </h2>
            <p
              className="text-center text-gray-400 mb-10 max-w-2xl mx-auto"
              data-aos="fade-up"
            >
              Our streamlined process makes it easy to report issues and get
              rewarded for your civic participation.
            </p>
            <div className="flex flex-wrap justify-center gap-8 ">
              <div className="relative flex flex-col items-center max-w-xs  transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4">
                  1
                </div>
                <div className="bg-gray-800  p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center h-full border-t-5 border-yellow-500">
                  <p className="text-white font-medium">
                    You Register the Complaint
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col items-center max-w-xs  transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4">
                  2
                </div>
                <div className="bg-gray-800   p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center h-full border-t-5   transform border-blue-500">
                  <p className="text-white font-medium">
                    Our Team Verifies and Shares it to the Responsible
                    Authorities
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col items-center max-w-xs  transition-all duration-300 transform hover:-translate-y-1 hover">
                <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4">
                  3
                </div>
                <div className="bg-gray-800  p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center h-full border-t-5 border-green-500">
                  <p className="text-white font-medium">
                    The Responsible Authorities Process the Complaint
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col items-center max-w-xs   transition-all duration-300 transform hover:-translate-y-1 hover">
                <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4">
                  4
                </div>
                <button className="bg-gray-800   p-6 rounded-lg shadow-md hover:shadow-lg   text-center h-full border-t-5 border-orange-500">
                  <p className="text-white font-medium">
                    Your Incentive is Provided Once the Complaint is Processed
                  </p>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <div
          ref={contactRef}
          id="contact"
          className="py-16 bg-gray-900"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-20">
            <h2
              className="text-3xl font-bold text-center mb-4 text-white"
              data-aos="fade-up"
            >
              Contact Us
            </h2>
            <p
              className="text-center text-gray-400 mb-10 max-w-2xl mx-auto"
              data-aos="fade-up"
            >
              Have questions or need assistance? Our support team is here to
              help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                className="flex flex-col items-center border-t-5 border-green-500 bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover"
                data-aos="fade-up"
              >
                <div className="bg-blue-900 p-4 rounded-full mb-6">
                  <img src={mail} alt="Support Mail" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Support Mail
                </h3>
                <p className="text-blue-500 font-medium cursor-pointer hover:underline">
                  support@civiceye.com
                </p>
                <p className="text-gray-400 text-center mt-4">
                  For general inquiries and support requests
                </p>
              </div>
              <div
                className="flex flex-col items-center border-t-5 border-blue-500 bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="bg-blue-900 p-4 rounded-full mb-6">
                  <img src={call} alt="Make A Call" className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  Make A Call
                </h3>
                <p className="text-blue-500 font-medium cursor-pointer hover:underline">
                  +123 456 7890
                </p>
                <p className="text-gray-400 text-center mt-4">
                  Available Monday-Friday, 9am-5pm
                </p>
              </div>
            </div>


            {/* Feedback Form */}
            <div
              className="mt-16 bg-gray-800 p-8 rounded-xl shadow-lg max-w-3xl mx-auto"
              data-aos="fade-up"
            >
              <h3 className="text-xl font-bold mb-4 text-white">
                Send Us Feedback
              </h3>
              <p className="text-gray-400 mb-6">
                We value your opinion and are constantly working to improve our
                service.
              </p>
              <form onSubmit={postfeedback} className="space-y-4">
                <textarea
                  className="w-full h-32 p-4 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-900text-gray-300"
                  name="description"
                  placeholder="Write your feedback or suggestions here..."
                  value={feedback.description}
                  onChange={feedbackchange}


                ></textarea>
                <button onClick={handelfeedClick} className="bg-blue-600 text-white px-6 py-3 mt-4 rounded-lg hover:bg-blue-700 transition duration-300 font-medium">
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* Logout Popup */}
        {feedbackpop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/80">
            <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl max-w-3xl w-full">
              <button
                onClick={() => setfeedbackpop(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                ✖
              </button>
              <Userfeedback onClose={() => setfeedbackpop(false)} />
            </div>
          </div>
        )}


        {/* Footer */}
        <footer className="bg-gray-800 text-white">
          <div className="max-w-6xl mx-auto py-12 px-4 sm:px-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Emergency Numbers Section */}
              <div>
                <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3 mb-6">
                  Emergency Numbers
                </h3>
                <div className="spacey-4">
                  <div>
                    <p className="font-medium text-gray-300 mb-2">Military</p>
                    <p className="text-gray-400">(123) 456-7890</p>
                    <p className="text-gray-400">(123) 456-7540</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-300 mb-2">
                      State Police
                    </p>
                    <p className="text-gray-400">(123) 456-7891</p>
                    <p className="text-gray-400">(123) 456-7892</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-300 mb-2">
                      Fire Department
                    </p>
                    <p className="text-gray-400">(123) 456-7892</p>
                  </div>
                </div>
              </div>

              {/* Contact Info Section */}
              <div>
                <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <p className="text-gray-400">
                      Softronics, Techpark, Innovation District
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </span>
                    <p className="text-gray-400">(+12) 34-5678</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.99.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V4h16v4.118z" />
                      </svg>
                    </span>
                    <p className="text-gray-400">support@civiceye.com</p>
                  </div>
                </div>
              </div>

              {/* Quick Links Section */}
              <div>
                <h3 className="text-lg font-semibold border-l-4 border-blue-500 pl-3 mb-6">
                  Quick Links
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-500 transition duration-300"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => navigate("/complaints")}
                      className="text-gray-400 hover:text-blue-500 transition duration-300"
                    >
                      My Complaints
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      onClick={scrollToAbout}
                      className="text-gray-400 hover:text-blue-500 transition duration-300"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      onClick={scrollToContact}
                      className="text-gray-400 hover:text-blue-500 transition duration-300"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright Section */}
            <div className="mt-12 border-t border-gray-700 pt-6 text-center">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} CivicEye. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
const Userfeedback = ({ onClose }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white text-center">
      <h2 className="text-xl font-semibold mb-4">FedddBack is Submited</h2>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  );
};
const AccountDelete = ({ onClose }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white text-center">
      <h2 className="text-xl font-semibold mb-4">Account Has Been Deleted</h2>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  );
};
export default Reghome;