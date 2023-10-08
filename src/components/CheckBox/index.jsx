import React, { useState } from 'react';

function Checkbox({name}) {
  // State to track the checkbox's checked status
  const [isChecked, setIsChecked] = useState(false);

  // Function to handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checked status
  };

  return (
    <label>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      {name}
    </label>
  );
}

export default Checkbox;