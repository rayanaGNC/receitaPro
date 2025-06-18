import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getRecipeById } from '../services/recipes';
import { toggleFavoriteRecipe, getFavoriteRecipes } from '../services/favorites';
import { Recipe } from '../types/recipe';
import { Ionicons } from '@expo/vector-icons';

export default function DetalhesReceita() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorito, setFavorito] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      const data = await getRecipeById(id);
      setRecipe(data);
      setLoading(false);

      const favs = await getFavoriteRecipes();
      const existe = favs.find(
        r => r.nome === data?.nome && r.preparo === data?.preparo
      );
      setFavorito(!!existe);
    };

    fetch();
  }, [id]);

  const handleFavoritar = async () => {
    if (!recipe) return;
    const novo = await toggleFavoriteRecipe(recipe);
    setFavorito(novo);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Receita não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.nome}</Text>
        <TouchableOpacity onPress={handleFavoritar} style={styles.favoriteButton}>
          <Ionicons
            name={favorito ? 'heart' : 'heart-outline'}
            size={28}
            color="#D9849F"
          />
        </TouchableOpacity>
      </View>

      {recipe.imagem && (
        <Image source={{ uri: recipe.imagem }} style={styles.image} />
      )}

      <Text style={styles.label}>Ingredientes:</Text>
      <Text style={styles.text}>{recipe.ingredientes}</Text>

      <Text style={styles.label}>Modo de Preparo:</Text>
      <Text style={styles.text}>{recipe.preparo}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push(`/receitas/editar/${id}`)}
      >
        <Text style={styles.editButtonText}>Editar Receita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#FFF1F3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#872341',
    fontFamily: 'PlayfairDisplay_700Bold',
    flex: 1,
  },
  favoriteButton: {
    marginLeft: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: '#E7A5A5',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#A45D6B',
    fontFamily: 'sans-serif',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5D2A42',
    fontFamily: 'sans-serif',
  },
  error: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: '#D62828',
    fontFamily: 'sans-serif',
  },
  editButton: {
    backgroundColor: '#D9849F',
    padding: 14,
    borderRadius: 10,
    marginTop: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  editButtonText: {
    color: '#FFF0F5',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
