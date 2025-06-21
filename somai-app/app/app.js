import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, View, StyleSheet } from 'react-native';
import axios from 'axios';

const API_URL = 'https://datalatih.siat.web.id/api/3/action/datastore_search';
const RESOURCE_ID = 'isi_dengan_resource_id_kamu';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSomai();
  }, []);

  const fetchSomai = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          resource_id: RESOURCE_ID,
          q: 'kecamatan:Baiturrahman'
        }
      });
      setData(response.data.result.records);
    } catch (error) {
      console.error('Gagal fetch:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Daftar Penjual Somai</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nama}</Text>
            <Text>{item.alamat}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  item: { marginBottom: 10, padding: 10, backgroundColor: '#eee', borderRadius: 8 },
});
