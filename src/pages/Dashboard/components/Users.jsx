import React, { useEffect, useState } from "react";
import { getUsers } from "../../../services/userService";
import { addressRequest, follow, unfollow } from "../../../services/followService";

const Users = () => {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const fetchData = async () => {
        try {
            const params = new URLSearchParams({ search }).toString();
            const response = await getUsers({ params });
            if (response?.data) {
                setUsers(response.data);
            }
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    useEffect(() => {
        fetchData();
    }, [search]);

    const cancelRequestHelper = async (id) => {
        try {
            await unfollow({ id });
            fetchData();
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    }

    const followUserHelper = async (id) => {
        try {
            await follow({ id });
            fetchData();
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    }

    const acceptRequestHelper = async (id) => {
        try {
            await addressRequest(id, { status: "Approved" });
            fetchData();
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    }

    const rejectRequestHelper = async (id) => {
        try {
            await addressRequest(id, { status: "Rejected" });
            fetchData();
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    }

    return (
        <div className="users-container">
            <h2 className="section-title">Users Listing</h2>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {users.length > 0 ? (
                <ul className="users-list">
                    {users?.map((user) => (
                        <li key={user._id} className="user-card">
                            <div className="user-info">
                                <div className="user-avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-details">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-email">{user.email}</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                {!user.followDetail || user?.followDetail?.length === 0 && (
                                    <button 
                                        className="action-btn follow-btn"
                                        onClick={() => followUserHelper(user?._id)}
                                    >
                                        Follow
                                    </button>
                                )}

                                {user.followDetail && user?.followDetail?.length === 1 && (
                                    user.followDetail[0].followerId === currentUser._id ? (
                                        <button 
                                            className="action-btn cancel-btn"
                                            onClick={() => cancelRequestHelper(user.followDetail[0]?._id)}
                                        >
                                            Cancel Request
                                        </button>
                                    ) : user.followDetail[0].followingId === currentUser._id ? (
                                        <>
                                            <button 
                                                className="action-btn accept-btn"
                                                onClick={() => acceptRequestHelper(user.followDetail[0]?._id)}
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                className="action-btn reject-btn"
                                                onClick={() => rejectRequestHelper(user.followDetail[0]?._id)}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : null
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-results">No users found.</div>
            )}
        </div>
    );
};

export default Users;
