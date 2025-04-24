import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_POST_ENCRYPTION_KEY;

export const decryptContent = (encryptedContent: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedContent, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Failed to decrypt content:', error);
        return '[Encrypted Content]';
    }
};

// export const encryptContent = (content: string): string => {
//     try {
//         return CryptoJS.AES.encrypt(content, ENCRYPTION_KEY).toString();
//     } catch (error) {
//         console.error('Failed to encrypt content:', error);
//         return content;
//     }
// }; 