import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/auth.service";

export default function Navbar() {
  const { data: username, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return (
    <header className="bg-white border-b px-6 py-3 flex justify-between">

      <input
        placeholder="Search..."
        className="bg-gray-100 px-3 py-2 rounded-md"
      />

      <div>
        👤 {
          error
            ? "Error"
            : isLoading
            ? "Loading..."
            : username || "Guest"
        }
      </div>

    </header>
  );
}