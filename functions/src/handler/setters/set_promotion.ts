import { Promotion, ShoppingCategory } from "../../interfaces/interfaces";
import Provider from "../../provider";
import {
  PromotionIdMissingError,
  CreditCardNotExistError,
  PromotionAlreadyExistError,
  ShoppingCategoryDataMissingError,
} from "../../config/errors";
import { setShoppingCategory } from "./set_category";

export async function setPromotion(
  userId: string,
  targetCardId: string,
  promotion: Promotion,
  provider: Provider
) {
  const userRef = provider.getUserRef(userId);
  const cardRef = userRef.collection("cards").doc(targetCardId);
  const cardSnap = await cardRef.get();
  if (cardSnap.exists) {
    if (promotion.id) {
      const promoRef = cardRef.collection("promos").doc(promotion.id);
      const promoSnap = await promoRef.get();
      if (promoSnap.exists) {
        throw PromotionAlreadyExistError;
      } else {
        await promoRef.set(promotion.toJSON());
        if (promotion.category) {
          await setShoppingCategory(
            userId,
            ShoppingCategory.create(promotion.category),
            provider
          );
        } else {
          throw ShoppingCategoryDataMissingError;
        }
      }
    } else {
      throw PromotionIdMissingError;
    }
  } else {
    throw CreditCardNotExistError;
  }
}
