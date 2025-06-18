import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "../types/recipe";

const FAVORITES_KEY = "@receitas_favoritas_objetos";

export async function toggleFavoriteRecipe(recipe: Recipe): Promise<boolean> {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  let current: Recipe[] = stored ? JSON.parse(stored) : [];

  const exists = current.find(
    (r) => r.nome === recipe.nome && r.preparo === recipe.preparo
  );

  let updated: Recipe[];

  if (exists) {
    updated = current.filter(
      (r) => r.nome !== recipe.nome || r.preparo !== recipe.preparo
    );
  } else {
    updated = [...current, recipe];
  }

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !exists;
}

export async function getFavoriteRecipes(): Promise<Recipe[]> {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}
