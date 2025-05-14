import React from 'react';

const ProfileUpdatedPopup = ({ onClose }) => {
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
            <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          
        </div>
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Profile Updated</h2>
        <p className="text-sm text-white mb-4">Your profile has been successfully updated.</p>
        <button onClick={onClose} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded">
          OK
        </button>
      </div>
    </div>
  );
};

export default ProfileUpdatedPopup;

