import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Recipe } from '../types/recipe';
import { useRouter } from "expo-router";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/receitas/${recipe.id}`)}
    >

      {recipe.imagem && (
        <Image source={{ uri: recipe.imagem }} style={styles.image} />
      )}

      <Text style={styles.title}>{recipe.nome}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFE5EC",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7A5A5',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#872341',
  },
});
