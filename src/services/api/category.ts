import { getTransactionSummary, listTransactions } from "./transaction";
import {
  CATEGORY_TYPE_LABELS,
  type CategoryType,
} from "@/schemas/category.schema";
import type { TransactionSummaryData } from "@/schemas/transaction.schema";
import { categoryTypeOf, resolveCategory } from "@/lib/format";

export type Category = {
  _id: string;
  name: string;
  type: CategoryType;
};

function mergeCategories(...lists: Category[][]): Category[] {
  const map = new Map<string, Category>();
  for (const list of lists) {
    for (const category of list) {
      map.set(category._id, category);
    }
  }
  return [...map.values()];
}

function categoriesFromSummary(data: TransactionSummaryData | undefined): Category[] {
  if (!data) return [];
  const map = new Map<string, Category>();

  for (const type of ["income", "expense", "savings"] as const) {
    for (const row of data[type] ?? []) {
      const resolved = resolveCategory(row.category);
      const id = resolved?._id;
      const name = resolved?.name?.trim();
      if (id && name) {
        map.set(id, { _id: id, name, type });
      }
    }
  }

  return [...map.values()];
}

function syntheticCategoriesFromTypes(types: CategoryType[]): Category[] {
  return types.map((type) => ({
    _id: type,
    name: CATEGORY_TYPE_LABELS[type],
    type,
  }));
}

async function categoriesFromTransactions(): Promise<Category[]> {
  try {
    const response = await listTransactions({ page: 1, limit: 100 });
    const map = new Map<string, Category>();

    for (const tx of response.data?.transactions ?? []) {
      const type = categoryTypeOf(tx.category);
      if (!type) continue;
      map.set(type, {
        _id: type,
        name: CATEGORY_TYPE_LABELS[type],
        type,
      });
    }

    return [...map.values()];
  } catch {
    return [];
  }
}

/** Categories for dashboard search — derived from summary and transaction history. */
export async function getCategoriesForTransaction(): Promise<Category[]> {
  let fromSummary: Category[] = [];
  try {
    const summary = await getTransactionSummary();
    fromSummary = categoriesFromSummary(summary.data);
  } catch {
    // new users may have empty summary
  }

  const fromTransactions = await categoriesFromTransactions();

  const merged = mergeCategories(fromSummary, fromTransactions);
  if (merged.length > 0) return merged;

  return syntheticCategoriesFromTypes(["income", "expense", "savings"]);
}

export async function getCategories() {
  try {
    const data = await getCategoriesForTransaction();
    return {
      message: "Done",
      success: true as const,
      status: 200,
      data,
    };
  } catch {
    return {
      message: "Done",
      success: true as const,
      status: 200,
      data: syntheticCategoriesFromTypes(["income", "expense", "savings"]),
    };
  }
}
