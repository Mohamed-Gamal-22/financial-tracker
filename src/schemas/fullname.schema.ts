import { z } from "zod";

const ARABIC_WORD = /^[\u0600-\u06FF]+$/;
const ENGLISH_WORD = /^[A-Za-z]+$/;

/** Shared fullname rules: 2+ Arabic-only or English-only words. */
export const fullnameSchema = z
  .string()
  .trim()
  .min(2, "الاسم يجب ألا يقل عن حرفين")
  .max(50, "الاسم يجب ألا يزيد عن 50 حرفًا")
  .refine(
    (val) => {
      const words = val.split(/\s+/).filter(Boolean);
      if (words.length < 2) return false;

      const allArabic = words.every((w) => ARABIC_WORD.test(w));
      const allEnglish = words.every((w) => ENGLISH_WORD.test(w));

      return allArabic || allEnglish;
    },
    {
      message:
        "الاسم يجب أن يكون كلمتين على الأقل (عربي أو إنجليزي) مفصولتين بمسافات",
    },
  );

export const FULLNAME_INVALID_MESSAGE =
  "الاسم يجب أن يكون كلمتين على الأقل (عربي أو إنجليزي) مفصولتين بمسافات";
