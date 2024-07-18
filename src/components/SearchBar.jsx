import React, { useState } from "react";

function SearchBar({ onSearch, children }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(e.target.value);
    onSearch(value);
  };

  return (
    <form>
      <input
        type="text"
        className="searchInput"
        name="search"
        value={searchTerm}
        placeholder={children}
        onChange={handleInputChange}
      />
    </form>
  );
}

export default SearchBar;
