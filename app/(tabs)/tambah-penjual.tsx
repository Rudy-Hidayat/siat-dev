import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';

const API_INSERT_URL = 'https://datalatih.siat.web.id/api/3/action/datastore_upsert';
const API_KEY = 'a2bd1ca3-ad9f-4be7-b436-573cfa6fa5ef';
const RESOURCE_ID = '1c1a2b78-cddd-4a13-92ec-2e73be483833'; // Baiturrahman

export default function TambahPenjualScreen() {
  const [form, setForm] = useState({
    id: '',
    region_code: '',
    nama_kotakab: 'BANDA ACEH',
    nama_kec: 'Baiturrahman',
    nama_gp: '',
    nama_penjual: '',
    gender: ''
  });

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const record = {
        ...form,
        id: Number(form.id) 
      };

      const response = await axios.post(API_INSERT_URL, {
        resource_id: RESOURCE_ID,
        method: 'insert',
        force: true,
        records: [record]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_KEY
        }
      });

      if (response.data.success) {
        Alert.alert('Sukses', 'Penjual berhasil ditambahkan!');
        router.back(); 
      } else {
        Alert.alert('Gagal', 'Data tidak berhasil ditambahkan');
      }
    } catch (err: any) {
      console.error('Insert Error:', err.response?.data || err.message);
      Alert.alert('Error', 'Terjadi kesalahan saat menambah data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Penjual Somai</Text>

      <TextInput style={styles.input} placeholder="ID (unik)" value={form.id} onChangeText={(text) => handleInputChange('id', text)} />
      <TextInput style={styles.input} placeholder="Kode Wilayah" value={form.region_code} onChangeText={(text) => handleInputChange('region_code', text)} />
      <TextInput style={styles.input} placeholder="Gampong" value={form.nama_gp} onChangeText={(text) => handleInputChange('nama_gp', text)} />
      <TextInput style={styles.input} placeholder="Nama Penjual" value={form.nama_penjual} onChangeText={(text) => handleInputChange('nama_penjual', text)} />
      <TextInput style={styles.input} placeholder="Gender" value={form.gender} onChangeText={(text) => handleInputChange('gender', text)} />

      <Button title="Tambah Penjual" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 6,
    borderRadius: 6
  }
});
