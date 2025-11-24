import { z } from "zod";

const username = z.string().min(1, "Username is required");
const email = z.email().min(1, "Email is required");
const password = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters long");
const address = z.string();
const age = z.coerce.number().min(0);
const styles = z.array(z.string());

export const signup = z.strictObject({
  username,
  email,
  password,
  address: address.optional(),
  age: age.optional(),
  styles: styles.optional(),
});

export const signin = z.strictObject({
  email,
  password,
});

export const refreshToken = z.strictObject({
  refreshToken: z.string(),
});
