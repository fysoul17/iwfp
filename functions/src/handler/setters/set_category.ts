import { ShoppingCategory } from "../../interfaces/interfaces";
import Provider from "../../provider";

export async function setShoppingCategory(
  userId: string,
  category: ShoppingCategory,
  provider: Provider
) {
  const userRef = provider.getUserRef(userId);
  const categoryRef = userRef.collection("categories").doc(category.id);
  await categoryRef.set(category.toJSON());
}
