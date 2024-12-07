import React, { useEffect, useState, useCallback } from "react";
import { getNotifications } from "../../../services/notificationService";
import { addressRequest } from "../../../services/followService";
import io from "socket.io-client";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Socket.IO connection setup
    useEffect(() => {
        const socketInstance = io("http://localhost:4000", {
            auth: {
                token: localStorage.getItem("access_token"),
                userId: currentUser._id
            },
            transports: ['websocket', 'polling'],
            withCredentials: true,
        });

        socketInstance.on("connect", () => {
            console.log("Connected to Socket.IO server");
            // Join user-specific room
            socketInstance.emit('join', `user_${currentUser._id}`);
        });

        socketInstance.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
            // Add more detailed error logging
            if (error.data) {
                console.error("Additional error data:", error.data);
            }
        });

        // Listen for notifications
        socketInstance.on("notification", handleNewNotification);

        setSocket(socketInstance);

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [currentUser._id]);

    // Handle incoming Socket.IO messages
    const handleNewNotification = useCallback((notification) => {
        try {
            const alteredNotification = alterNotification(notification);
            if (alteredNotification) {
                setNotifications(prev => [alteredNotification, ...prev]);
            }
        } catch (error) {
            console.error('Error handling socket message:', error);
        }
    }, []);

    // Single notification transformation
    const alterNotification = (notification) => {

        if (notification?.relatedModel === "follow") {
            if (notification?.type === "Action") {
                if (notification?.relatedData?.status === "Pending") {
                    return {
                        ...notification,
                        title: "New Follow Request",
                        text: `${notification?.relatedData?.followerDetail?.name || "n/a"} has sent you a follow request.`,
                        icon: "👥"
                    };
                } else if (notification?.relatedData?.status === "Approved") {
                    return {
                        ...notification,
                        title: "Follow Request Accepted",
                        text: `You have accepted the follow request from ${notification?.relatedData?.followerDetail?.name || "n/a"}.`,
                        icon: "✅"
                    };
                } else {
                    return {
                        ...notification,
                        title: "Follow Request Rejected",
                        text: `You have rejected the follow request from ${notification?.relatedData?.followerDetail?.name || "n/a"}.`,
                        icon: "❌"
                    };
                }
            } else {
                // Handle Message type for follow model
                if (notification?.relatedData?.status === "Approved") {
                    return {
                        ...notification,
                        title: "Request Accepted",
                        text: `${notification?.relatedData?.followingDetail?.name || "n/a"} has accepted your follow request.`,
                        icon: "✅"
                    };
                }
            }
        } else if (notification?.type === "Message") {
            // Handle post likes
            return {
                ...notification,
                title: "Post Liked",
                text: `${notification?.relatedData?.userDetail?.name || "n/a"} has liked your post.`,
                icon: "❤️"
            };
        }
        
        // Default case
        return {
            ...notification,
            title: "Notification",
            text: "You have a new notification",
            icon: "📬"
        };
    };

    // Initial fetch of notifications
    const fetchData = async () => {
        try {
            const response = await getNotifications();
            if (response?.data) {
                const alterData = response.data
                    .map(alterNotification)
                    .filter(Boolean); // Remove null values
                setNotifications(alterData);
            }
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle follow request actions
    const acceptRequestHelper = async (id) => {
        try {
            await addressRequest(id, { status: "Approved" });
            if (socket) {
                socket.emit('followAction', {
                    action: 'accept',
                    requestId: id
                });
            }
            // Update local state
            setNotifications(prev => prev.map(notif =>
                notif?.relatedData?._id === id
                    ? {
                        ...notif,
                        title: "Follow Request Accepted",
                        text: `You accepted the follow request from ${notif?.relatedData?.followerDetail?.name || "Someone"}.`,
                        icon: "✅",
                        relatedData: { ...notif.relatedData, status: "Approved" }
                    }
                    : notif
            ));
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    const rejectRequestHelper = async (id) => {
        try {
            await addressRequest(id, { status: "Rejected" });
            if (socket) {
                socket.emit('followAction', {
                    action: 'reject',
                    requestId: id
                });
            }
            // Remove the notification from local state
            setNotifications(prev => prev.filter(notif => notif?.relatedData?._id !== id));
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    return (
        <div className="notifications-container">
            <h2 className="section-title">Notifications</h2>
            {notifications.length > 0 ? (
                <ul className="notifications-list">
                    {notifications?.map((notification) => {
                        return (
                            <li
                                key={notification._id}
                                className="notification-card"
                                data-type={notification.relatedModel}
                            >
                                <div className="notification-content">
                                    <div className={`notification-icon ${notification.relatedModel}`}>
                                        {notification.icon}
                                    </div>

                                    <div className="notification-details">
                                        <h3 className="notification-title">
                                            {notification.title}
                                        </h3>
                                        <p className="notification-text">
                                            {notification.text}
                                        </p>
                                    </div>
                                </div>

                                {notification?.relatedModel === "follow" &&
                                    notification?.type === "Action" &&
                                    notification?.relatedData?.status === "Pending" &&
                                    notification?.relatedData?.followingId === currentUser?._id && (
                                        <div className="notification-actions">
                                            <button
                                                className="action-button accept"
                                                onClick={() => acceptRequestHelper(notification?.relatedData?._id)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="action-button reject"
                                                onClick={() => rejectRequestHelper(notification?.relatedData?._id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="no-notifications">
                    <div className="empty-icon">🔔</div>
                    <p>No notifications found.</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;
