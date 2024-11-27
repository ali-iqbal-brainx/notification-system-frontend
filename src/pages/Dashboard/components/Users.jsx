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
        <div>
            <br />
            <h2>Users Listing</h2>
            <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <br /><br />
            {users.length > 0 ? (
                <ul>
                    {users?.map((user) => (
                        <li key={user._id}>
                            <strong>Name:</strong> {user.name} {" "} <strong>Email:</strong> {user.email}

                            {!user.followDetail || user?.followDetail?.length === 0 && (
                                <button onClick={() => followUserHelper(user?._id)}>Follow</button>
                            )}

                            {user.followDetail && user?.followDetail?.length === 1 && (
                                user.followDetail[0].followerId === currentUser._id ? (
                                    <button onClick={() => cancelRequestHelper(user.followDetail[0]?._id)}>Cancel Request</button>
                                ) : user.followDetail[0].followingId === currentUser._id ? (<>
                                    <button onClick={() => acceptRequestHelper(user.followDetail[0]?._id)}>Accept</button>
                                    <button onClick={() => rejectRequestHelper(user.followDetail[0]?._id)}>Reject</button>
                                </>
                                ) : null
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default Users;
