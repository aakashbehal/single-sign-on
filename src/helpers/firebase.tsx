import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { userService } from '../services';

const firebaseConfig = {
    apiKey: "AIzaSyCCnehE1827Mtb16sS6WMB8nAWzNoKt-G4",
    authDomain: "document-manager-ffc73.firebaseapp.com",
    projectId: "document-manager-ffc73",
    storageBucket: "document-manager-ffc73.appspot.com",
    messagingSenderId: "909463760025",
    appId: "1:909463760025:web:d3eb33c770813a4c5a5c08",
    measurementId: "G-6HHHLLZ8SH"
};

initializeApp(firebaseConfig)

const messaging = getMessaging();
export const requestForToken = () => {
    return getToken(messaging, {
        vapidKey: 'BBY_eV0Fg-EaJ7bzenUji2uJG6YSPlnzMYZ7mSqztelo8rOMPuV9eC6tInZpfOO0YMTKoRDPQ7cagqUqowfBi1o'
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

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

export const deleteFBToken = async () => {
    await deleteToken(messaging)
}