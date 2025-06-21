import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import axios from 'axios';

const API_URL = 'https://datalatih.siat.web.id/api/3/action/datastore_search';
const DELETE_URL = 'https://datalatih.siat.web.id/api/3/action/datastore_delete';
const RESOURCE_ID = '1c1a2b78-cddd-4a13-92ec-2e73be483833'; // Baiturrahman
const API_KEY = 'a2bd1ca3-ad9f-4be7-b436-573cfa6fa5ef';

type Somai = {
  id: number;
  region_code: string;
  nama_kotakab: string;
  nama_kec: string;
  nama_gp: string;
  nama_penjual: string;
  gender: string;
};

export default function HomeScreen() {
  const [data, setData] = useState<Somai[]>([]);

  const fetchSomai = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          resource_id: RESOURCE_ID,
          limit: 100
        }
      });
      setData(response.data.result.records);
    } catch (err) {
      console.error('Error ambil data:', err);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah kamu yakin ingin menghapus data ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await axios.post(DELETE_URL, {
                resource_id: RESOURCE_ID,
                force: true,
                filters: { id }
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: API_KEY
                }
              });

              if (res.data.success) {
                Alert.alert('Sukses', 'Data berhasil dihapus');
                fetchSomai();
              } else {
                Alert.alert('Gagal', 'Gagal menghapus data');
              }
            } catch (err: any) {
              console.error('Delete Error:', err.response?.data || err.message);
              Alert.alert('Error', 'Gagal menghapus data');
            }
          }
        }
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchSomai();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Penjual Somai di Baiturrahman</Text>

      <Link href="/tambah-penjual">
        <Text style={styles.addButton}>➕ Tambah Penjual</Text>
      </Link>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.nama_penjual}</Text>
            <Text>Gampong: {item.nama_gp}</Text>
            <Text>Kecamatan: {item.nama_kec}</Text>
            <Text>Gender: {item.gender.trim()}</Text>

            <View style={styles.buttonGroup}>
              <Link
                href={{
                  pathname: '/edit-penjual',
                  params: {
                    id: item.id,
                    region_code: item.region_code,
                    nama_gp: item.nama_gp,
                    nama_penjual: item.nama_penjual,
                    gender: item.gender
                  }
                }}
              >
                <Text style={styles.editButton}>✏️ Edit</Text>
              </Link>

              <Pressable onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButton}>🗑️ Hapus</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  addButton: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 10
  },
  item: {
    padding: 12,
    backgroundColor: '#eee',
    marginVertical: 6,
    borderRadius: 8
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 16
  },
  editButton: {
    color: 'blue',
    fontSize: 14
  },
  deleteButton: {
    color: 'red',
    fontSize: 14
  }
});
