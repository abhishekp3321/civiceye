import { useNavigate } from "react-router-dom";

const Profilelogout = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-lg shadow-lg p-8 w-96">
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="relative w-20 h-20 mb-4">
          <div className="relative bg-white rounded-full p-3 flex items-center justify-center">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <text x="7" y="20" fontSize="25" fontWeight="bold">?</text>
            </svg>
          </div>
        </div>

        <p className="text-sm text-white mb-4">Are you sure you want to log out?</p>
        <div className="flex justify-between gap-10 mt-6">
          <button onClick={() => navigate('/homeguest')} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Yes, Logout
          </button>
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profilelogout;
