import { z } from "zod";

const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export default verifySchema;
