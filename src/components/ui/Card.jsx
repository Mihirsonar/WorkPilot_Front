 import React from 'react'
 
export default function Card({ children }) {
  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      {children}
    </div>
  );
}