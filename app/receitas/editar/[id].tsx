import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getRecipeById, updateRecipe } from '../../services/recipes';
import { uploadToCloudinary } from '../../services/cloudinary';
import { Recipe } from '../../types/recipe';

export default function EditarReceita() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [preparo, setPreparo] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const carregarReceita = async () => {
      if (!id) return;
      const receita = await getRecipeById(id);
      if (receita) {
        setNome(receita.nome);
        setIngredientes(receita.ingredientes);
        setPreparo(receita.preparo);
        setOriginalImageUrl(receita.imagem || null);
      }
      setLoading(false);
    };

    carregarReceita();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const salvarEdicao = async () => {
    if (!id || !nome || !ingredientes || !preparo) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      let imageUrl = originalImageUrl || '';

      if (imageUri && imageUri !== originalImageUrl) {
        imageUrl = await uploadToCloudinary(imageUri);
      }

      await updateRecipe(id, {
        nome,
        ingredientes,
        preparo,
        imagem: imageUrl,
      });

      Alert.alert('Sucesso', 'Receita atualizada com sucesso!');
      router.push('/(tabs)/');
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a receita.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Receita</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da receita"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Ingredientes"
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Modo de preparo"
        value={preparo}
        onChangeText={setPreparo}
        multiline
      />

     <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
      <Text style={styles.imageButtonText}>Selecionar nova imagem</Text>
     </TouchableOpacity>


      {(imageUri || originalImageUrl) && (
        <Image
          source={{ uri: imageUri || originalImageUrl! }}
          style={styles.image}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={salvarEdicao}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF1F3', // fundo rosa muito claro
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#872341', // vinho rosé
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7A5A5', // rosa pastel
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#FFF8F9',
    color: '#5C2A3E', // texto escuro rosado
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 12,
    borderColor: '#EECED3',
    borderWidth: 1,
  },
  imageButton: {
    backgroundColor: '#EFA7A7', // rosa claro
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  imageButtonText: {
    color: '#FFF0F5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#D9849F', // rosa queimado
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF0F5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
