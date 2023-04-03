import React from 'react'

const Filter = ({ handleSearch, search }) => (
    <div>
      filter shown with:
      <input name="name" onChange={handleSearch} value={search} />
    </div>
  );

export default Filter
