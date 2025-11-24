import { z } from "zod";

const email = z.string().email();
const address = z.string();
const age = z.string();
const styles = z.array(z.string());

export const profile = z.strictObject({
  email,
  address,
  age,
  styles,
});
