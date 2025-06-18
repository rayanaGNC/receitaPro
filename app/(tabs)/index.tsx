import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Recipe } from '../types/recipe';
import { getAllRecipes } from '../services/recipes';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRecipes = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.nome &&
      recipe.nome.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/receitas/${item.id}`)}
    >
      {item.imagem && (
        <Image source={{ uri: item.imagem }} style={styles.image} />
      )}
      <Text style={styles.title}>{item.nome}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar receita"
        placeholderTextColor="#E7A5A5"
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
        style={styles.favButton}
        onPress={() => router.push('/receitas/favoritos')}
      >
        <Text style={styles.addButtonText}>Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/receitas/nova')}
      >
        <Text style={styles.addButtonText}>Nova Receita</Text>
      </TouchableOpacity>

      {filteredRecipes.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma receita encontrada.</Text>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id || item.nome}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF1F3',
  },
  search: {
    borderWidth: 1,
    borderColor: '#E7A5A5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#FFF8F9',
  },
  addButton: {
    backgroundColor: '#D9849F',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  favButton: {
    backgroundColor: '#EFA7A7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF0F5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFE5EC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7A5A5',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#872341',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#B67A86',
  },
});
