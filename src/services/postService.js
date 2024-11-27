import {
    authorizedPostCall,
    authorizedPutCall,
    authorizedGetCall,
    authorizedDeleteCall,
} from "./APIsService";

export const getPosts = async (data) => {
    return new Promise((resolve, reject) => {
        authorizedGetCall(`/post/post_listing?${data?.params}`)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const likePost = async (data) => {
    return new Promise((resolve, reject) => {
        authorizedPostCall(`/post/like_post`, data)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const dislikePost = async (id) => {
    return new Promise((resolve, reject) => {
        authorizedDeleteCall(`/post/unlike_post/${id}`)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const addPost = async (body) => {
    return new Promise((resolve, reject) => {
        authorizedPostCall(`/post/add_post`, body)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const deletePost = async (id) => {
    return new Promise((resolve, reject) => {
        authorizedDeleteCall(`/post/delete_post/${id}`)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};