import cookie from "cookie";
import jwt from "jsonwebtoken";

const socketAuth = (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
   
    if (!cookies) {
      return next(new Error("No cookies found"));
    }

    const parsed = cookie.parse(cookies);
    const token = parsed.token;

    if (!token) {
      return next(new Error("No token"));
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = user;
    // console.log(user) // attach user to socket
    next(); // ✅ allow
  } catch (err) {
    next(new Error("Authentication failed"));
  }
};

export default socketAuth;