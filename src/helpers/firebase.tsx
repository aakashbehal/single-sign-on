import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { userService } from '../services';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
    measurementId: process.env.REACT_APP_FIREBASE_MESUREMENTID,
};

initializeApp(firebaseConfig)

const messaging = getMessaging();
export const requestForToken = () => {
    return getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
    }).then(async (currentToken) => {
        if (currentToken) {
            await userService.registerFireBaseToken(currentToken)
            // Perform any other neccessary action with the token
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
};

export const onMessageListener = () => {
    return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
}

export const deleteFBToken = async () => {
    try {
        console.log(messaging)
        return deleteToken(messaging)
    } catch (err: any) {
        throw err.message
    }
}