import React, { useEffect, useState } from "react";
import { useUpdateUserForHomeMutation } from "../services/homeApi";

const UserModal = ({ userModal, setUserModal, dbUserList, selectedHome }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [updateUserForHome] = useUpdateUserForHomeMutation();

  useEffect(() => {
    setSelectedUsers(dbUserList);
  }, []);

  const handleSave = async () => {
    try {
      const usersToAdd = selectedUsers.filter(user => !dbUserList.includes(user));
      const usersToRemove = dbUserList.filter(user => !selectedUsers.includes(user));

      await updateUserForHome({
        updateUser: { add: usersToAdd, remove: usersToRemove },
        street_address: selectedHome
      }).unwrap();
      
      setUserModal(false);
    } catch (err) {
      console.error("Failed to update user-home associations:", err);
    }
  };

  const handleCheckboxChange = (user) => {
    setSelectedUsers(prevSelected =>
      prevSelected.includes(user)
        ? prevSelected.filter(item => item !== user)
        : [...prevSelected, user]
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity ${
        userModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h4 className="text-xl font-bold mb-6 text-center">{selectedHome}</h4>
        <h2 className="text-lg font-semibold mb-4">Select Users</h2>
        <div className="space-y-2 mb-4">
          {Array.from({ length: 10 }, (_, i) => `user${i + 1}`).map(user => (
            <div key={user} className="flex items-center">
              <input
                type="checkbox"
                id={user}
                value={user}
                checked={selectedUsers.includes(user)}
                onChange={() => handleCheckboxChange(user)}
                className="mr-2"
              />
              <h4 className="text-sm">{user}</h4>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setUserModal(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedUsers.length === 0}
            className={`${selectedUsers.length === 0 ? "bg-gray-300" : "bg-blue-500"} px-4 py-2 text-white rounded-md`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserModal);