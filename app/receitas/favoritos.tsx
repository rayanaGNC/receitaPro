import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getFavoriteRecipes } from '../services/favorites';
import { Recipe } from '../types/recipe';
import { useRouter } from 'expo-router';
import RecipeCard from '../components/RecipeCard';

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        const receitas = await getFavoriteRecipes();
        console.log('🔍 Receitas favoritas carregadas:', receitas);
        setFavoritos(receitas);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarFavoritos();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receitas Favoritas</Text>

      {favoritos.length === 0 ? (
        <Text style={styles.empty}>Sem receitas favoritas</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.nome + item.preparo}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/receitas/${item.id ?? ''}`)}>
              <RecipeCard recipe={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF1F3',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#872341',
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#A45D6B',
    fontFamily: 'sans-serif',
  },
});
