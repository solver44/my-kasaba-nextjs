import React, { useState } from "react";
import styles from './searchButton.module.scss';

function SearchButton({ onSearch }) {
  const [searchText, setSearchText] = useState(""); // State to store the search text

  const handleSearch = () => {
    onSearch(searchText); // Pass the search text to the parent component
  };

  return (
    <div>
      <input
        type="text"
        className={styles.inp}
        placeholder="Izlash..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button className={styles.btn} onClick={handleSearch}>Qidiruv</button>
    </div>
  );
}

export default SearchButton;