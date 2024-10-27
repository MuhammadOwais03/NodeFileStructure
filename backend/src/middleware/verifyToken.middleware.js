import jwt from 'jsonwebtoken';
import { generateAccessTokenFromRefreshToken } from '../utils/token.utils';
import asyncHandler from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 
    if (!token) return res.status(403).json(new ApiResponse(403, null, 'Access denied'));

    try {
        const payload = jwt.verify(token, process.env.ACCESS_SECRET_KEY); 
        req.user = payload; 
        return next(); 
    } catch (err) {
        
        const refreshToken = req.cookies?.refreshToken;
        const newAccessToken = await generateAccessTokenFromRefreshToken(refreshToken); 

        
        if (newAccessToken instanceof ApiResponse) {
            return res.status(401).json(
                new ApiResponse(401, newAccessToken.data, newAccessToken.message)
            );
        }

        
        const options = {
            httpOnly: true,
            secure: false,
        };

        res.cookie('accessToken', newAccessToken, options); 
        req.user = jwt.verify(newAccessToken, process.env.ACCESS_SECRET_KEY); 
        return next(); 
    }
});

export default verifyToken;
