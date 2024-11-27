import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Users from "./components/Users";
import Posts from "./components/Posts";
import Notifications from "./components/Notifications.jsx";
import "./styles.css";
import { useAuth } from '../../AuthContext.jsx';


function Dashboard() {
    const [activeTab, setActiveTab] = useState("users");
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const renderComponent = () => {
        switch (activeTab) {
            case "users":
                return <Users />;
            case "posts":
                return <Posts />;
            case "notifications":
                return <Notifications />;
            default:
                return <Users />;
        }
    };

    return (
        <div>
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />
            {renderComponent()}
        </div>
    );
}

export default Dashboard;
