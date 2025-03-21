import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';
import { json } from 'express';

const checkAuth = async (req, res, next) => {
    let jsonWebToken;    
    // Comprobar que se esta enviando el JWT con el bearer
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            jsonWebToken = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(jsonWebToken, process.env.JWT_SECRET);

            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');

            return next();
            
        } catch (error) {
            const e = new Error('JWT no valido');
            res.status(403).json({msg: e.message});
        }
    }

    if(!jsonWebToken) {
        const error = new Error('JWT inexistente');
        return res.status(403).json({msg: error.message});
    }
    
    next();
};

export default checkAuth;