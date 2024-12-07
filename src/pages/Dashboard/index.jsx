import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Users from "./components/Users";
import Posts from "./components/Posts";
import Notifications from "./components/Notifications.jsx";
import "./styles.css";
import { useAuth } from '../../AuthContext.jsx';


const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("users");
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="dashboard-container">
            <Navbar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                handleLogout={handleLogout} 
            />
            <div className="content-container">
                {activeTab === "users" && <Users />}
                {activeTab === "posts" && <Posts />}
                {activeTab === "notifications" && <Notifications />}
            </div>
        </div>
    );
};

export default Dashboard;
