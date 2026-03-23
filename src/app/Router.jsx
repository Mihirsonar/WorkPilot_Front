import { BrowserRouter,Route,Routes } from "react-router-dom";
import React from "react";
import Layout from "../components/Layout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/project";
import MyTasks from "../pages/tasks/MyTasks";
import ProtectedRoute from "../components/project/ProtectedRoute";
import ProjectDetails from "../pages/projects/projectDetails";
import CreateProjectModel from "../components/project/CreateProjectModel";
export default function Router(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register />} />
            <Route element={<Layout/>}>
        <Route
        path="/"
        element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>          
                <Route path="/projects" element={<Projects />} />
                <Route path="/my-tasks" element={<MyTasks />} />  
                <Route path="/create-project" element={<CreateProjectModel />} /> 
                <Route path ="/projects/:projectId" element={<ProjectDetails />} />    
            </Route>
        </Routes>
        </BrowserRouter>
    )
}