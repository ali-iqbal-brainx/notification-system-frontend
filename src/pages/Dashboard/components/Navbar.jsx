import React from "react";

const Navbar = ({ activeTab, setActiveTab, handleLogout }) => {
    return (
        <nav>
            <button
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
            >
                Users Listing
            </button>
            <button
                className={activeTab === "posts" ? "active" : ""}
                onClick={() => setActiveTab("posts")}
            >
                Posts
            </button>
            <button
                className={activeTab === "notifications" ? "active" : ""}
                onClick={() => setActiveTab("notifications")}
            >
                Notifications
            </button>
            <button
                onClick={handleLogout}
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
