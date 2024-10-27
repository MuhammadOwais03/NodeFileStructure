import jwt from 'jsonwebtoken';
import userSchema from '../models/user.models.js';
import { ApiResponse } from './ApiResponse.js';

export const generateToken = async (userID, username) => {
    const accessToken = jwt.sign(
        { userId: userID, username: username },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: process.env.ACCESS_EXPIRES }
    );

    const refreshToken = jwt.sign(
        { userId: userID },
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: process.env.REFRESH_EXPIRES }
    );

    return { accessToken, refreshToken }; 
};

export const generateAccessTokenFromRefreshToken = async (refreshToken) => {
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
        const user = await userSchema.findOne({ _id: payload.userId });

        
        if (!user) {
            return new ApiResponse(404, null, "User not found");
        }

        
        const newAccessToken = jwt.sign(
            { userId: user._id, username: user.username }, 
            process.env.ACCESS_SECRET_KEY,
            { expiresIn: process.env.ACCESS_EXPIRES }
        );

        return newAccessToken
    } catch (error) {
        return new ApiResponse(401, null, "Refresh Token Expired");
    }
};
