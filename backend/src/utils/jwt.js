import jwt from "jsonwebtoken";

export function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tenantId: user.tenantId ? user.tenantId.toString() : null,
      username: user.username,
      role: user.role,
      isGuest: user.isGuest,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
