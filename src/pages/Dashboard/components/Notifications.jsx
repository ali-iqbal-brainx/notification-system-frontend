import React, { useEffect, useState } from "react";
import { getNotifications } from "../../../services/notificationService";
import { addressRequest } from "../../../services/followService";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const alterNotifications = (data) => {
        return data?.map(notification => {
            if (notification?.relatedModel === "follow") {
                if (notification?.type === "Action") {
                    if (notification?.relatedData?.status === "Pending") {
                        return {
                            ...notification,
                            title: "New Follow Request",
                            text: `${notification?.relatedData?.followerDetail?.name || "n/a"} has sent you a follow request.`
                        };
                    } else if (notification?.relatedData?.status === "Approved") {
                        return {
                            ...notification,
                            title: "Follow Request Accepted",
                            text: `You have accepted the follow request from ${notification?.relatedData?.followerDetail?.name || "n/a"}.`
                        };
                    } else {
                        return {
                            ...notification,
                            title: "Follow Request Rejected",
                            text: `You have rejected the follow request from ${notification?.relatedData?.followerDetail?.name || "n/a"}.`
                        };
                    }
                } else {
                    if (notification?.relatedData?.status === "Approved") {
                        return {
                            ...notification,
                            title: "Request Accepted",
                            text: `${notification?.relatedData?.followingDetail?.name || "n/a"} has accepted your follow request.`
                        };
                    }
                }
            } else if (notification?.type === "Message") {
                return {
                    ...notification,
                    title: "Post Liked",
                    text: `${notification?.relatedData?.userDetail?.name || "n/a"} has liked your post.`
                };
            }
        });
    }

    const fetchData = async () => {
        try {
            const response = await getNotifications();
            if (response?.data) {
                const alterData = alterNotifications(response?.data);
                setNotifications(alterData);
            }
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            <h2>Notifications Listing</h2>
            <br />
            {notifications.length > 0 ? (
                <ul>
                    {notifications?.map((notification) => (
                        <li key={notification._id}>
                            <strong>Title:</strong> {notification.title}<br />
                            <strong>Desc:</strong> {notification.text} <br />
                            {
                                notification?.relatedModel === "follow" &&
                                notification?.type === "Action" &&
                                notification?.relatedData?.status === "Pending" &&
                                notification?.relatedData?.followingId === currentUser?._id && (
                                    <>
                                        <button onClick={() => acceptRequestHelper(notification?.relatedData?._id)}>Accept</button>
                                        <button onClick={() => rejectRequestHelper(notification?.relatedData?._id)}>Reject</button>
                                    </>
                                )
                            }
                            <br /><br /><br />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notifications found.</p>
            )}
        </div>
    );
};

export default Notifications;
