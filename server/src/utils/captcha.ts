import dotenv from 'dotenv';
import Bun from 'bun';

dotenv.config();
export const validateCaptcha = async (token: string) => {
    console.log(token);
    const secret = process.env.RECAPTCHA_SECRET;
    console.log(secret);
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return { success: data.success as boolean };
    }
    catch (error) {
        console.log(error);
    }
}