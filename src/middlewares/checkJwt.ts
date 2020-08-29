import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authConfig = require('../config/auth');

export const checkJwt  = (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;
    
    let jwtPayload;
    
    try {
        
        if(!authHeader)
        return response.status(401).send({ error: 'No token provided' });
        
        const parts = authHeader.split(' ');
        
        if(!(parts.length === 2))
            return response.status(401).send({ error: 'Token error' });
        
        const [ scheme, token ] = parts;

        if(!/^Bearer$/i.test(scheme))
            return response.status(401).send({ error: 'Token malformatted' });

        jwtPayload = jwt.verify(token, authConfig.secret);
        
        response.locals.jwtPayload = jwtPayload;

        next();
                
    }   catch(error) {
        return response.status(401).send({ error: 'Token invalid' });
    }

};