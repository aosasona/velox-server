import type { Secret } from "jsonwebtoken";

interface Config {
  port: number | string;
  jwtSecret: Secret;
  bcryptSalt: number | string;
}

const config: Config = {
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || "secret",
  bcryptSalt: process.env.BCRYPT_SALT || 12,
};

export default config;
