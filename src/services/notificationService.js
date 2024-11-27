import {
    authorizedPostCall,
    authorizedPutCall,
    authorizedGetCall,
    authorizedDeleteCall,
} from "./APIsService";

export const getNotifications = async (data) => {
    return new Promise((resolve, reject) => {
        authorizedGetCall(`/notification?${data?.params}`)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};