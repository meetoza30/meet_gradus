const jwt = require("jsonwebtoken");
const { google } = require("googleapis");



const userAuth = async(req,res,next)=>{
    try {
        const {token} = req.cookies;
    if(!token) throw new Error("Invalid entry, please login again")
    const decodedId = await jwt.verify(token, "Gradus123")
    } catch (error) {
        
    }
}

const oauth2Client = new google.auth.OAuth2("1017273854064-c3qd54ot3vsjtq6k205ph55n3t31bflo.apps.googleusercontent.com", "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", "http://localhost:5000/auth/google/callback");

const getAuthURL = ()=>{
    const scopes = ['https://www.googleapis.com/auth/youtube.force-ssl']
    return oauth2Client.generateAuthUrl({
        access_type : "offline",
        scope: scopes,
        prompt: 'consent'
    });
};

const getTokens = async (code)=>{
    console.log(code)
    const {tokens} = await oauth2Client.getToken(code);
    console.log(tokens)
    return tokens;
}

module.exports = { getAuthURL, getTokens, oauth2Client };
