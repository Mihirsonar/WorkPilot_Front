import React from 'react'

export default function Navbar() {
  return (
    <header className="bg-white border-b px-6 py-3 flex justify-between">

      <input
        placeholder="Search..."
        className="bg-gray-100 px-3 py-2 rounded-md"
      />

      <div>
        👤 Mihir
      </div>

    </header>
  );
}