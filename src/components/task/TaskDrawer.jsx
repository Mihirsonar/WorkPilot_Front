// import React from "react";


// import { motion } from "framer-motion";
// import { useQuery } from "@tanstack/react-query";
// import { useState, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateTask } from "../../services/task.services";
// import {getProjectMembers} from "../../services/project.services.js"
// import toast from "react-hot-toast";

// function TaskDrawer({ task, onClose, projectId }) {

//   const{  data: members = [] } = useQuery({
//     queryKey : ["members",projectId],
//     queryFn : () => getProjectMembers(projectId)
//   })

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     status: "todo",
//     assignedTo: "",
//     dueDate: "",

//   });

//   const queryClient = useQueryClient();

//   useEffect(() => {
//     if (task) {
//       setForm({
//         title: task.title || "",
//         description: task.description || "",
//         status: task.status || "todo",
//         assignedTo: task.assignedTo || "",
//         dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
//       });
//     }
//   }, [task]);


//   const mutation = useMutation({
//     mutationFn: updateTask,

//     onMutate: async ({ taskId, data }) => {
//       await queryClient.cancelQueries({
//         queryKey: ["tasks", projectId]
//       });

//       const previous = queryClient.getQueryData(["tasks", projectId]);

//       queryClient.setQueryData(["tasks", projectId], (old = []) =>
//         old.map((t) =>
//           t._id === taskId ? { ...t, ...data } : t
//         )
//       );
      
//       return { previous };
//     },

//     onError: (err, variables, context) => {
//       queryClient.setQueryData(["tasks", projectId], context.previous);
//       toast.error("Update failed");
//     },

//     onSuccess: () => {
//       toast.success("Task updated");
//     }
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSave = () => {
//     mutation.mutate({
//       projectId,
//       taskId: task._id,
//       data: form
//     });
//     onClose();
//   };

//   if (!task) return null;

//   return (
//     <>
//       <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />

//       <motion.div
//         initial={{ x: "100%" }}
//         animate={{ x: 0 }}
//         className="fixed right-10 top-5 h-full w-[620px] bg-white z-50 shadow-xl p-6 flex flex-col overflow-y-auto"
//       >

//         {/* <h2 className="text-xl font-semibold mb-4">Task Details</h2> */}

//         <h2 className="text-md font-semibold ">Title</h2>

//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Title"
//         />

//         <h2 className="text-md font-semibold ">Description</h2>

//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Write the description of Task"
//         />

// <div className="flex items-end-safe m-2">
// <div className="flex gap-3 ">
// <h2 className="mt-1">status</h2>
//         <select
//           name="status"
//           value={form.status}
//           onChange={handleChange}
//           className="w-50 border p-0.5 rounded mb-3"
//         >
//           <option value="todo">Todo</option>
//           <option value="in_progress">In Progress</option>
//           <option value="done">Done</option>
//         </select>

//         <div className="flex gap-2 ml-2">
// <h2 className="mt-1">Due Date</h2>
//        <input
//           type="date"
//           name="dueDate"
//           value={form.dueDate}
//           onChange={handleChange}
//           className="w-50 border p-0.5 rounded mb-3"
//         />
// </div>
// </div>
// </div>



 


// <div className="flex mt-2 gap-3">
//   <label className="text-sm text-gray-500">Assignees</label>

//   <div className="border rounded p-1 space-y-2 max-h-40 w-50 overflow-y-auto">

//     {members.map((m) => {
//       const user = m.user;
//       const isSelected = form.assignedTo === user._id;

//       return (
//         <div
//           key={user._id}
//           onClick={() =>
//             setForm({ ...form, assignedTo: user._id })
//           }
//           className={`flex items-center gap-2 p-2 rounded cursor-pointer transition
//             ${isSelected ? "bg-indigo-100" : "hover:bg-gray-100"}`}
//         >

//           {/* Avatar */}
//           <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
//             {user.username?.charAt(0).toUpperCase()}
//           </div>

//           {/* Name */}
//           <span className="text-sm font-medium">
//             {user.username}
//           </span>            
//         </div>
//       );
//     })}

//   </div>
// </div>

//         <div className="mt-auto flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 border p-2 rounded"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSave}
//             className="flex-1 bg-indigo-600 text-white p-2 rounded"
//           >
//             Save
//           </button>
//         </div>

//       </motion.div>
//     </>
//   );
// }

// export default TaskDrawer;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../../services/task.services";
import { getProjectMembers } from "../../services/project.services.js";
import toast from "react-hot-toast";

function TaskDrawer({ task, onClose, projectId }) {
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ["members", projectId],
    queryFn: () => getProjectMembers(projectId)
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    assignedTo: "",
    dueDate: ""
  });

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        assignedTo: task.assignedTo || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
      });
    }
  }, [task]);

  const mutation = useMutation({
    mutationFn: updateTask,
    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const previous = queryClient.getQueryData(["tasks", projectId]);

      queryClient.setQueryData(["tasks", projectId], (old = []) =>
        old.map((t) => (t._id === taskId ? { ...t, ...data } : t))
      );

      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["tasks", projectId], context.previous);
      toast.error("Update failed");
    },
    onSuccess: () => {
      toast.success("Task updated");
    }
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    mutation.mutate({
      projectId,
      taskId: task._id,
      data: form
    });
    onClose();
  };

  const filteredMembers = members.filter((m) =>
    m.user.username.toLowerCase().includes(search.toLowerCase())
  );

  if (!task) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        className="fixed right-0 top-0 h-full w-[640px] bg-white z-50 shadow-2xl px-6 py-5 flex flex-col overflow-y-auto rounded-l-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="text-xl font-semibold outline-none w-full"
            placeholder="Untitled Task"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div className="relative">
            <p className="text-gray-400 mb-1">Assignees</p>

            <div
              onClick={() =>
                setShowAssigneeDropdown(!showAssigneeDropdown)
              }
              className="flex items-center gap-2 cursor-pointer"
            >
              {form.assignedTo ? (
                (() => {
                  const selectedUser = members.find(
                    (m) => m.user._id === form.assignedTo
                  )?.user;

                  return (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
                        {selectedUser?.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                      <span className="text-sm">
                        {selectedUser?.username}
                      </span>
                    </div>
                  );
                })()
              ) : (
                <span className="text-gray-500 text-sm">
                  Unassigned
                </span>
              )}
            </div>

            {showAssigneeDropdown && (
              <div className="absolute top-12 left-0 w-full bg-white border rounded-xl shadow-lg p-3 z-50">
                <input
                  type="text"
                  placeholder="Search or enter email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 mb-3 border rounded-lg outline-none text-sm"
                />

                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredMembers.map((m) => {
                    const user = m.user;
                    const isSelected =
                      form.assignedTo === user._id;

                    return (
                      <div
                        key={user._id}
                        onClick={() => {
                          setForm({
                            ...form,
                            assignedTo: user._id
                          });
                          setShowAssigneeDropdown(false);
                        }}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
                          ${
                            isSelected
                              ? "bg-indigo-50"
                              : "hover:bg-gray-100"
                          }`}
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm">
                            {user.username
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user.username}
                          </span>
                          <span className="text-xs text-gray-400">
                            {user.email || ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-3 p-2 mt-2 border-t cursor-pointer hover:bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                      +
                    </div>
                    <span className="text-sm font-medium">
                      Invite people via email
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-gray-400 mb-1">Status</p>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-2 py-1 rounded-md bg-gray-50"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Due Date</p>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-2 py-1 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <p className="text-gray-400 mb-1">Priority</p>
            <div className="px-2 py-1 rounded-md bg-gray-50 text-gray-500">
              Empty
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">
            Description
          </p>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write something..."
            className="w-full p-3 rounded-lg bg-gray-50 outline-none min-h-[120px]"
          />
        </div>

        <div className="mt-auto flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default TaskDrawer;


