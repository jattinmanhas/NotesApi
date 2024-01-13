const jwtUtils = require('../utils/jwt');

exports.authentication = (req, res, next) => {
    const token = req.signedCookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized Access"});
    }

    try{
        const {name, userId, email} = jwtUtils.isTokenValid({token});

        req.user = {name, userId, email}

        next();
    }catch(err){
        return res.status(400).json({error : err.message})
    }
}

