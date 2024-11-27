import {
    authorizedPostCall,
    authorizedPutCall,
    authorizedGetCall,
    authorizedDeleteCall,
} from "./APIsService";

export const getUsers = async (data) => {
    return new Promise((resolve, reject) => {
        authorizedGetCall(`/user/user_listing?${data?.params}`)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};