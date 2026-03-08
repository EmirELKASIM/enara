import jwt from "jsonwebtoken";

export const generateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET || "");
};
export const verifyJWT = (token: any) => {
  const data = jwt.verify(
    token,
    process.env.JWT_SECRET || ""
  ) as jwt.JwtPayload;
  return { id: data.id, email: data.email };
};