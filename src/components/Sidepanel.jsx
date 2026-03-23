import React from 'react'

function Sidepanel() {
    return (
    <aside className="w-60 bg-white border-r p-4">

      <h1 className="text-xl font-bold text-indigo-600 mb-6">
        WorkPilot
      </h1>

      <nav className="flex flex-col gap-2">

        <Link to="/" className="p-2 rounded hover:bg-gray-100">
          Dashboard
        </Link>

        <Link to="/projects" className="p-2 rounded hover:bg-gray-100">
          Projects
        </Link>

        <Link to="/my-tasks" className="p-2 rounded hover:bg-gray-100">
          My Tasks
        </Link>

      </nav>

    </aside>
  );
}

export default Sidepanel