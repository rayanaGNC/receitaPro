import React, { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addRecipe } from '../services/recipes';
import { uploadToCloudinary } from '../services/cloudinary';

export default function NovaReceita() {
  const [nome, setNome] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [preparo, setPreparo] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

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

  const salvar = async () => {
    if (!nome || !ingredientes || !preparo) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      let imageUrl = '';
      if (imageUri) {
        imageUrl = await uploadToCloudinary(imageUri);
      }

      await addRecipe({
        nome,
        ingredientes,
        preparo,
        imagem: imageUrl,
      });

      Alert.alert('Sucesso', 'Receita salva com sucesso!');
      router.push('/(tabs)/');
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      Alert.alert('Erro', 'Não foi possível salvar a receita.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Receita</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da receita"
        placeholderTextColor={"#E7A5A5"}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Ingredientes"
        placeholderTextColor={"#E7A5A5"}
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Modo de preparo"
        placeholderTextColor={"#E7A5A5"}
        value={preparo}
        onChangeText={setPreparo}
        multiline
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
       <Text style={styles.imageButtonText}>Selecionar imagem</Text>
      </TouchableOpacity>


      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={salvar}>
        <Text style={styles.saveButtonText}>Salvar Receita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF1F3', 
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#843B4D', 
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#F4C2C2', 
    backgroundColor: '#FFF8F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    color: '#843B4D',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 14,
  },
  imageButton: {
    backgroundColor: '#EFA7A7', 
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#B35C79',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFF0F5',
    fontSize: 17,
    fontWeight: 'bold',
  },
});