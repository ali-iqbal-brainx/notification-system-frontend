import {
    authorizedPostCall,
    authorizedPutCall,
    authorizedGetCall,
    authorizedDeleteCall,
} from "./APIsService";

export const follow = async (data) => {
    return new Promise((resolve, reject) => {
        authorizedPostCall(`/follow/${data?.id}`)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const unfollow = async (data) => {
    return new Promise((resolve, reject) => {
        authorizedDeleteCall(`/follow/${data?.id}`)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const addressRequest = async (id, data) => {
    return new Promise((resolve, reject) => {
        authorizedPutCall(`/follow/address_request/${id}`, data)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};