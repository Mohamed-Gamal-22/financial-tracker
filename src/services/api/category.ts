import { authedApiRequest } from "./authed-client";
import type { CategoryType } from "@/schemas/category.schema";

export type Category = {
  _id: string;
  name: string;
  type: CategoryType;
};

/** GET /category — read-only list for regular users */
export function getCategories() {
  return authedApiRequest<Category[]>("/category", { method: "GET" });
}
