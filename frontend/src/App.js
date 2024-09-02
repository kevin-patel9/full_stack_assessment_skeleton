import React, { useState, useEffect } from "react";
import "./App.css";
import { useFindTotalPageCountMutation, useFindUserByHomeMutation } from "./services/homeApi";
import UserModal from "./components/Modal";
import { useGetAllSelectedHomeUserMutation } from "./services/userApi";

const App = () => {
  const [userHomeData, setUserHomeData] = useState([]);
  const [dbUserList, setDbUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("None");
  const [selectedHome, setSelectedHome] = useState("");
  const [findUserByHome] = useFindUserByHomeMutation();
  const [findTotalPageCount] = useFindTotalPageCountMutation();
  const [getAllSelectedHomeUser] = useGetAllSelectedHomeUserMutation();

  // Fetch user homes and total page count whenever the current page or selected user changes
  useEffect(() => {
    if (selectedUser !== "None") {
      const fetchUserData = async () => {
        try {
          const [userResponse, pageCountResponse] = await Promise.all([
            findUserByHome({ username: selectedUser, page: currentPage }).unwrap(),
            findTotalPageCount({ username: selectedUser }).unwrap()
          ]);

          setUserHomeData(userResponse?.userHomes);
          setTotalPage(pageCountResponse?.totalPages);

        } catch (err) {
          console.error("Failed to fetch user details:", err);
        }
      };

      fetchUserData();
    }
  }, [selectedUser, currentPage]);

  const handleFetchUserHome = async (username) => {
    setCurrentPage(1);
    setSelectedUser(username);
    setUserDropdownOpen(false);
  };

  const users = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10"];

  const handleDropDown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleSelectedHome = async(homeAddress) => {
    try {
      const response = await getAllSelectedHomeUser({ homeAddress }).unwrap();
      setDbUserList(response?.usernames);
      setSelectedHome(homeAddress);
      
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    }
    setUserModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPage) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="h-full my-8 relative">
      <div className="flex justify-end items-center gap-x-3 m-10">
        <h2 className="text-lg font-semibold">Select User:</h2>
        <div
          onClick={handleDropDown}
          className="cursor-pointer border px-4 py-2 rounded-md"
        >
          <h3 className="font-medium text-sm">{selectedUser}</h3>
        </div>
      </div>
      {userDropdownOpen && (
        <div className="absolute right-10 top-12 w-full sm:w-40 bg-white border rounded-md shadow-lg z-50">
          {users.map((item) => (
            <div
              key={item}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleFetchUserHome(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
      {userHomeData?.homes?.length > 0 ? (
        <div className="flex flex-wrap mx-10 justify-around gap-8">
          {userHomeData.homes.map((home) => (
            <div
              key={home.id}
              className="bg-white p-4 border rounded-md shadow-lg flex flex-col gap-y-2 w-[250px]"
            >
              <h3 className="text-lg font-semibold">
                {home.street_address.length > 20 ? <>{home.street_address.slice(0, 20)}...</> : home.street_address}
              </h3>
              <p className="text-sm">List Price: ${home.list_price}</p>
              <p className="text-sm">State: {home.state}</p>
              <p className="text-sm">Zip: {home.zip}</p>
              <p className="text-sm">Sqft: {home.sqft}</p>
              <p className="text-sm">Beds: {home.beds}</p>
              <p className="text-sm">Baths: {home.baths}</p>
              <button onClick={() => {
                  setUserDropdownOpen(false);
                  handleSelectedHome(home.street_address);
                }} 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">Nothing to show</div>
      )}

      {userHomeData?.homes?.length > 0 &&
       <div className="flex justify-center items-center mt-4 gap-x-2">
        {/* Pagination */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &laquo; Previous
        </button>
        {Array.from({ length: totalPage }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border border-gray-300 rounded-md ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPage}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next &raquo;
        </button>
      </div>}
      {userModal &&
        <UserModal 
          userModal={userModal} 
          setUserModal={setUserModal} 
          dbUserList={dbUserList}
          selectedHome={selectedHome}
        />
      }
    </div>
  );
};

export default App;