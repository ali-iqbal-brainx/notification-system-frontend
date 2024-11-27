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
        <div>
            <br />
            <button onClick={() => setIsModalOpen(true)}>Add Post</button>
            <br /><br />
            <h2>Posts Listing</h2>
            <input
                type="text"
                placeholder="Search by title or text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            /> <br /><br />


            {posts.length > 0 ? (
                <ul>
                    {posts?.map((post) => (
                        <li key={post._id}>
                            <strong>Title:</strong> {post.title}<br />
                            <strong>Desc:</strong> {post.text} <br />
                            <button
                                className={post?.isUserItselfLike ? "active" : ""}
                                onClick={() => {
                                    if (post?.isUserItselfLike) {
                                        dislikePostHelper(post?.userLike?.[0]?._id);
                                    } else {
                                        likePostHelper(post?._id);
                                    }
                                }}
                            >
                                Like
                            </button>
                            {" " + post?.likeDetail?.length || 0}
                            {
                                post?.userId === currentUser?._id && (
                                    <img
                                        src={deleteIcon}
                                        alt="delete-icon" width={15} height={15}
                                        className="delete-icon"
                                        onClick={() => { deletePostHelper(post?._id) }}
                                    />
                                )
                            }
                            <br /><br /><br />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts found.</p>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New Post</h3>
                        <label>
                            Title:
                            <input
                                type="text"
                                value={newPost.title}
                                onChange={(e) =>
                                    setNewPost({ ...newPost, title: e.target.value })
                                }
                                placeholder="Enter title"
                            />
                        </label>
                        <br />
                        <label>
                            Description:
                            <textarea
                                value={newPost.text}
                                onChange={(e) =>
                                    setNewPost({ ...newPost, text: e.target.value })
                                }
                                placeholder="Enter description"
                            />
                        </label>
                        <br />
                        <button onClick={handleAddPost}>Add</button>
                        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Posts;
