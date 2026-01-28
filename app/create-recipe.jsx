// app/create-recipe.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CreateRecipeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Recipe Screen (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    color: '#666666',
  },
});