import React, { useEffect, useState } from "react";
import { dislikePost, getPosts, likePost, addPost, deletePost } from "../../../services/postService";
import deleteIcon from "../../../assets/icons/delete.svg";

const Posts = () => {
    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', text: '' });
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const fetchData = async () => {
        try {
            const params = new URLSearchParams({ search }).toString();
            const response = await getPosts({ params });
            if (response?.data) {
                setPosts(response.data);
            }
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    useEffect(() => {
        fetchData();
    }, [search]);

    const likePostHelper = async (postId) => {
        try {
            await likePost({ postId });
            fetchData();
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    const dislikePostHelper = async (postId) => {
        try {
            await dislikePost(postId);
            fetchData();
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    const handleAddPost = async () => {
        try {
            await addPost(newPost);
            fetchData();
            setNewPost({ title: '', text: '' });
            setIsModalOpen(false);
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    const deletePostHelper = async (id) => {
        try {
            await deletePost(id);
            fetchData();
            setNewPost({ title: '', text: '' });
        } catch (error) {
            alert(error?.response?.data?.error || "Error Occurred");
        }
    };

    return (
        <div className="posts-container">
            <div className="posts-header">
                <h2 className="section-title">Posts Listing</h2>
                <button 
                    className="add-post-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add Post
                </button>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by title or text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {posts.length > 0 ? (
                <ul className="posts-list">
                    {posts?.map((post) => (
                        <li key={post._id} className="post-card">
                            <div className="post-content">
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-text">{post.text}</p>
                                
                                <div className="post-actions">
                                    <button
                                        className={`like-button ${post?.isUserItselfLike ? "active" : ""}`}
                                        onClick={() => {
                                            if (post?.isUserItselfLike) {
                                                dislikePostHelper(post?.userLike?.[0]?._id);
                                            } else {
                                                likePostHelper(post?._id);
                                            }
                                        }}
                                    >
                                        <span className="like-icon">♥</span>
                                        <span className="like-count">{post?.likeDetail?.length || 0}</span>
                                    </button>

                                    {post?.userId === currentUser?._id && (
                                        <button
                                            className="delete-post-button"
                                            onClick={() => { deletePostHelper(post?._id) }}
                                            title="Delete post"
                                        >
                                            <svg 
                                                width="16" 
                                                height="16" 
                                                viewBox="0 0 16 16" 
                                                fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path 
                                                    d="M2.5 4H3.5H13.5" 
                                                    stroke="currentColor" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round"
                                                />
                                                <path 
                                                    d="M5.5 4V3C5.5 2.46957 5.71071 1.96086 6.08579 1.58579C6.46086 1.21071 6.96957 1 7.5 1H8.5C9.03043 1 9.53914 1.21071 9.91421 1.58579C10.2893 1.96086 10.5 2.46957 10.5 3V4M12.5 4V13C12.5 13.5304 12.2893 14.0391 11.9142 14.4142C11.5391 14.7893 11.0304 15 10.5 15H5.5C4.96957 15 4.46086 14.7893 4.08579 14.4142C3.71071 14.0391 3.5 13.5304 3.5 13V4H12.5Z" 
                                                    stroke="currentColor" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-results">No posts found.</div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Add New Post</h3>
                        <div className="modal-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={newPost.title}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, title: e.target.value })
                                    }
                                    placeholder="Enter title"
                                    className="modal-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newPost.text}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, text: e.target.value })
                                    }
                                    placeholder="Enter description"
                                    className="modal-textarea"
                                />
                            </div>
                            <div className="modal-actions">
                                <button 
                                    className="modal-button submit-btn"
                                    onClick={handleAddPost}
                                >
                                    Add
                                </button>
                                <button 
                                    className="modal-button cancel-btn"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Posts;
