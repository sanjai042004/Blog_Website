import { NavLink, useNavigate } from "react-router-dom";
import { TfiWrite } from "react-icons/tfi";
import { CiSearch } from "react-icons/ci";
import { TbCompass } from "react-icons/tb";
import { useState, useRef, useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { ProfileDropdown } from "../ui";


export const Navbar = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate(`/`);
    }
  };

  const handleExploreClick = () => {
    navigate("/explore");
    setShowDropdown(false);
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-8 py-8 border-b border-gray-200 sticky top-0 bg-white z-50">
    
      <div className="text-2xl font-bold text-black">
        <NavLink to="/">CodeVerse</NavLink>
        
      </div>

     
      <div className="relative flex-1 mx-8" ref={searchRef}>
        <form onSubmit={handleSearch}>
          <div className="flex gap-2 items-center bg-gray-50 w-full max-w-md p-1 rounded-2xl">
            <CiSearch className="size-7" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.trim() !== "") {
                  setShowDropdown(false);
                }
              }}
              onFocus={() => {
                if (searchTerm.trim() === "") {
                  setShowDropdown(true);
                }
              }}
              className="flex-1 bg-transparent outline-none p-2 rounded"
            />
          </div>
        </form>

        {showDropdown && searchTerm.trim() === "" && (
          <div
            className="absolute top-12 left-0 bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition w-full max-w-md"
            onClick={handleExploreClick}
          >
            <div className="flex items-center gap-3">
              <TbCompass  className="size-7 text-gray-500" />
              <span className="text-sm font-medium">Explore topics</span>
              <span className="ml-auto text-gray-400">→</span>
            </div>
          </div>
        )}
      </div>

     
      <ul className="mr-6 hidden md:flex">
        <li>
          <NavLink
            to="/write"
            className="text-gray-600 hover:text-black text-xl"
            title="Write"
          >
            <TfiWrite />
          </NavLink>
        </li>
      </ul>

     
      <ul className="hidden md:flex space-x-6 items-center">
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive
                ? "text-green-700 font-semibold border-b-2 border-green-700 pb-1"
                : "text-gray-700 hover:text-black"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-green-700 font-semibold border-b-2 border-green-700 pb-1"
                : "text-gray-700 hover:text-black"
            }
          >
            About
          </NavLink>
        </li>
      </ul>

      
      <ProfileDropdown />
    </nav>
  );
};
