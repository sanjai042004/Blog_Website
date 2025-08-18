const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {

      user = await User.create({
        name,
        email,
        googleId,
        profileImage: payload.picture, 
      });
    } else {
      user.name = name;
      user.profileImage = payload.picture;
      await user.save();
    }

  
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.status(200).json({ token, user });
    
  } catch (err) {
    console.error("Google login error:", err);
    res.status(400).json({ message: "Google login failed" });
  }
};
