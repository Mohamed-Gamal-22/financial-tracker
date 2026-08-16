import { z } from "zod";
import { fullnameSchema } from "./fullname.schema";

/** PATCH /user/name */
export const updateNameSchema = z.object({
  fullname: fullnameSchema,
});

export type UpdateNameInput = z.infer<typeof updateNameSchema>;
