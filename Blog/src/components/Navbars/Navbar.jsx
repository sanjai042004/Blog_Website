import { NavLink, useNavigate } from "react-router-dom";
import { CiSearch, CiMenuBurger, CiBellOn } from "react-icons/ci";
import { useState, useRef, useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { ProfileDropdown } from "../ui";
import axios from "axios";
import { TbCompass } from "react-icons/tb";
import { TfiWrite } from "react-icons/tfi";

export const Navbar = ({ toggleSidebar }) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Fetch search suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/search?q=${searchTerm}`
        );
        setSuggestions(res.data.posts || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    } else {
      navigate("/explore");
    }
  };

  const handleExploreClick = () => {
    navigate("/explore");
    setShowDropdown(false);
  };

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-2 border-b border-gray-300 sticky top-0 bg-white z-50">
      {/* Logo + Hamburger */}
      <div className="flex items-center gap-2 text-2xl font-bold text-black">
        <button className="cursor-pointer" onClick={toggleSidebar}>
          <CiMenuBurger />
        </button>
        <NavLink to="/home">CodeVerse</NavLink>
      </div>

      {/* Search */}
      <div className="relative flex-1 mx-4 md:mx-8" ref={searchRef}>
        <form onSubmit={handleSearch}>
          <div className="flex gap-3 items-center bg-gray-50 w-full max-w-md rounded-2xl px-3 py-2">
            <CiSearch className="text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </form>

        {showDropdown && (
          <div className="absolute top-full mt-2 left-0 w-full max-w-md bg-white shadow-lg rounded-lg p-2 z-50">
            {searchTerm.trim() === "" ? (
              <div
                onClick={handleExploreClick}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <TbCompass className="text-gray-500 text-xl" />
                <span className="text-sm font-medium">Explore topics</span>
                <span className="ml-auto text-gray-400">→</span>
              </div>
            ) : (
              suggestions.map((post) => (
                <div
                  key={post._id}
                  onClick={() => {
                    navigate(`/post/${post._id}`);
                    setShowDropdown(false);
                  }}
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  {post.title}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Actions → always visible */}
      <div className="flex items-center gap-4">
        <NavLink
          to="/write"
          className="flex gap-2 items-center text-gray-600 hover:text-black text-lg"
          title="Write"
        >
          <TfiWrite /> <span className="hidden sm:inline">Write</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className="text-gray-600 hover:text-black text-2xl"
          title="Notifications"
        >
          <CiBellOn />
        </NavLink>

        <ProfileDropdown />
      </div>
    </nav>
  );
};
