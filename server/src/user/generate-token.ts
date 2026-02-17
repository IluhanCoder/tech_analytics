import jwt from "jsonwebtoken";

  const generateToken = (id: string) => {
    return jwt.sign({ id },process.env.TOKEN_KEY ?? "", {
      expiresIn: 3 * 24 * 60 * 60,
    });
  };

export default generateToken;