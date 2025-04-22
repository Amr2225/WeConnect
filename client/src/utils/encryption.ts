import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-key';

export const decrypt = (encryptedContent: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption failed:', error);
        return 'Error decrypting content';
    }
}; 