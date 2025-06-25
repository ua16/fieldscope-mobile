import {  useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { initDB, fetchPeople, clearPeople } from './database';

export default function PeopleTable() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    (async () => {
      await initDB();
      const results = await fetchPeople();
      setPeople(results);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Called every time screen comes into focus
      (async () => {
        await initDB();
        const results = await fetchPeople();
        setPeople(results);
      })();
    }, [])
  );

    const clearStuff = async () => {
        await clearPeople();
        const results = await fetchPeople();
        setPeople(results);
    }


  return (
    <View>
      <Button title="Clear" onPress={clearStuff}/>
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={styles.cell}>ID</Text>
            <Text style={styles.cell}>Name</Text>
            <Text style={styles.cell}>Age</Text>
            <Text style={styles.cell}>Blood</Text>
            <Text style={styles.cell}>Gender</Text>
          </View>
          {people.map((person) => (
            <View key={person.id} style={styles.row}>
              <Text style={styles.cell}>{person.id}</Text>
              <Text style={styles.cell}>{person.name}</Text>
              <Text style={styles.cell}>{person.age}</Text>
              <Text style={styles.cell}>{person.blood_group}</Text>
              <Text style={styles.cell}>{person.gender}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#eee',
  },
  cell: {
    padding: 8,
    width: 100,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
});

