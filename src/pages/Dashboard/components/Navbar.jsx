import React from "react";

const Navbar = ({ activeTab, setActiveTab, handleLogout }) => {
    return (
        <nav className="dashboard-nav">
            <button
                className={`nav-button ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
            >
                Users Listing
            </button>
            <button
                className={`nav-button ${activeTab === "posts" ? "active" : ""}`}
                onClick={() => setActiveTab("posts")}
            >
                Posts
            </button>
            <button
                className={`nav-button ${activeTab === "notifications" ? "active" : ""}`}
                onClick={() => setActiveTab("notifications")}
            >
                Notifications
            </button>
            <button
                className="nav-button logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
