import { z } from "zod";

const acceptmessage = z.object({
  acceptMessage: z.boolean(),
});

export default acceptmessage;
