import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { initDB, fetchPeople, clearPeople, insertPerson } from './database';
import { getValue } from './localStore';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function PhotoCaptureScreen() {
  const [image, setImage] = useState(null);
  const [metadata, setMetadata] = useState({ name: '', age: '', blood_group: '', gender: '' });

  let [serverAddr, setServerAddr] = useState('') ;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required');
      }
      await initDB();
      let temp = await getValue("serverAddr");
      setServerAddr(temp);

    })();
  }, []);
  useFocusEffect(
    useCallback(() => {
      // Called every time screen comes into focus
      (async () => {
        let temp = await getValue("serverAddr");
        setServerAddr(temp);
      })();
    }, [])
  );



  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri); 
    }

  };

  const handleInputChange = (key, value) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };
  const submitForm = async () => {
      await insertPerson(metadata.name, metadata.age, metadata.blood_group, metadata.gender);
      
  } 

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.photoButton} onPress={openCamera}>
          <View style={styles.circle}>
            {image ? (
              <Image source={{ uri: image }} style={styles.photoPreview} />
            ) : (
              <Text>📷</Text>
            )}
          </View>
        </TouchableOpacity>

      <Text>Server is {serverAddr}</Text>




      <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={metadata.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Age"
            value={metadata.age}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('age', text)}
          />

          <Text style={{ marginTop: 10 }}>Blood Group</Text>
          <Picker
            selectedValue={metadata.blood_group}
            onValueChange={(value) => handleInputChange('blood_group', value)}
            style={styles.input}
          >
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <Picker.Item key={bg} label={bg} value={bg} />
            ))}
          </Picker>

          <Text style={{ marginTop: 10 }}>Gender</Text>
          <Picker
            selectedValue={metadata.gender}
            onValueChange={(value) => handleInputChange('gender', value)}
            style={styles.input}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>

      <Button title="submit" onPress={submitForm}/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  photoButton: { marginTop: 30 },
  circle: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2, borderColor: 'black',
    justifyContent: 'center', alignItems: 'center'
  },
  photoPreview: { width: 100, height: 100, borderRadius: 50 },
  form: { width: '100%' },
  input: {
    borderWidth: 1, borderColor: 'gray',
    padding: 10, marginVertical: 5, borderRadius: 5
  },
  bottomButtons: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%'
  },
});

