import {
    postCall
} from './APIsService';

export const isLoggedIn = () => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (!token || !refreshToken) {
        return false;
    }
    return true;
};

export const logIn = async (body) => {
    return new Promise((resolve, reject) => {
        postCall('/auth/log_in', body)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const signUp = async (body) => {
    return new Promise((resolve, reject) => {
        postCall('/auth/sign_up', body)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
