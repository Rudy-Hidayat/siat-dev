import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, router } from 'expo-router';

const API_KEY = 'a2bd1ca3-ad9f-4be7-b436-573cfa6fa5ef';
const API_UPDATE_URL = 'https://datalatih.siat.web.id/api/3/action/datastore_upsert';
const RESOURCE_ID = '1c1a2b78-cddd-4a13-92ec-2e73be483833'; // Baiturrahman

export default function EditPenjualScreen() {
  const params = useLocalSearchParams();

  const [form, setForm] = useState({
    id: 0,
    region_code: '',
    nama_kotakab: 'BANDA ACEH',
    nama_kec: 'Baiturrahman',
    nama_gp: '',
    nama_penjual: '',
    gender: ''
  });

  useEffect(() => {
    if (params && params.id) {
      setForm({
        id: Number(params.id),
        region_code: params.region_code as string,
        nama_kotakab: 'BANDA ACEH',
        nama_kec: 'Baiturrahman',
        nama_gp: params.nama_gp as string,
        nama_penjual: params.nama_penjual as string,
        gender: params.gender as string
      });
    }
  }, [params.id]);

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = async () => {
    if (!form.nama_penjual.trim() || !form.nama_gp.trim()) {
      Alert.alert('Validasi', 'Nama penjual dan gampong tidak boleh kosong.');
      return;
    }

    try {
      const response = await axios.post(
        API_UPDATE_URL,
        {
          resource_id: RESOURCE_ID,
          method: 'update',
          force: true,
          records: [form],
          filters: { id: form.id }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: API_KEY
          }
        }
      );

      if (response.data.success) {
        Alert.alert('Sukses', 'Data berhasil diperbarui!');
        router.back();
      } else {
        Alert.alert('Gagal', 'Gagal memperbarui data');
      }
    } catch (err: any) {
      console.error('Update Error:', err.response?.data || err.message);
      Alert.alert('Error', 'Terjadi kesalahan saat update data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Data Penjual</Text>

      <TextInput
        style={styles.input}
        value={form.region_code}
        onChangeText={(text) => handleInputChange('region_code', text)}
        placeholder="Kode Wilayah"
      />
      <TextInput
        style={styles.input}
        value={form.nama_gp}
        onChangeText={(text) => handleInputChange('nama_gp', text)}
        placeholder="Gampong"
      />
      <TextInput
        style={styles.input}
        value={form.nama_penjual}
        onChangeText={(text) => handleInputChange('nama_penjual', text)}
        placeholder="Nama Penjual"
      />
      <TextInput
        style={styles.input}
        value={form.gender}
        onChangeText={(text) => handleInputChange('gender', text)}
        placeholder="Gender"
      />

      <Button title="💾 Simpan Perubahan" onPress={handleUpdate} />
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
