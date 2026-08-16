import { z } from "zod";

/**
 * PATCH /user/name
 *
 * Signup requires exactly two English words. This endpoint's example uses
 * three ("Raneem Magdy Elmahdy"), so we allow two or more English words
 * separated by a single space and surface any stricter backend rules via
 * API field errors.
 */
export const updateNameSchema = z.object({
  fullname: z
    .string()
    .trim()
    .regex(/^[A-Za-z]+(?: [A-Za-z]+)+$/, {
      message:
        "الاسم يجب أن يكون كلمتين إنجليزيتين أو أكثر مفصولتين بمسافة واحدة",
    }),
});

export type UpdateNameInput = z.infer<typeof updateNameSchema>;
