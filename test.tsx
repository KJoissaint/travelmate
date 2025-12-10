import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '@/utils/env';

import { Image } from 'expo-image';
import {
  Alert,
  Platform,
  SafeAreaViewBase,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  View,
  ActivityIndicator,
  FlatList,
  ScrollView
} from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';


interface User {
  id: number,
  name: string;
  email: string
}

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
  photos: string[];
  location: { lat: number; lng: number };
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ProductItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
}



const ShoppingCart = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Iphone 15",
      price: 999,
      quantity: 0
    },
    {
      id: 2,
      name: "Samsung Galaxy S23",
      price: 899,
      quantity: 0
    },
    {
      id: 3,
      name: "Google Pixel 8",
      price: 799,
      quantity: 0
    }
  ]);

  const handledAdd = (id: number) => {
    setProducts(products.map(product =>
      product.id === id
        ? { ...product, quantity: product.quantity + 1 } : product));
  }

  const handleRemove = (id: number) => {
    setProducts(products.map(product =>
      product.id === id && product.quantity > 0
        ? { ...product, quantity: product.quantity - 1 } : product));
  }

  const totalItems = products.reduce((total, product) => total + product.quantity, 0);
  const totalPrice = products.reduce((total, product) => total + (product.price * product.quantity), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> 🛒  My cart</Text>
      <ScrollView style = {styles.productList}>
        {
          products.map(product => (
            <ProductItem
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
              onAdd={handledAdd}
              onRemove={handleRemove}
            />
          ))
        }
      </ScrollView>

      <View style ={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Articles: </Text>
          <Text style={styles.summaryValue}>{totalItems}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Articles: </Text>
          <Text style={styles.summaryValue}>€{totalPrice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.checkoutButton, totalItems === 0 && styles.checkoutButtonDisabled ]} 
          onPress={() => alert('Checkout')}
          disabled={totalItems === 0}
          >
          <Text style={styles.checkoutText}>{totalItems === 0 ? "Panier vide" : 'Commander'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



const ProductItem: React.FC<ProductItemProps> = ({ id, name, price, quantity, onAdd, onRemove }) => {
  return (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>€{price}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => onAdd(id)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity style={styles.button} onPress={() => onRemove(id)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
};


const TripsList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MOCK_BACKEND_URL = config.mockBackendUrl;
  const DEBUG_MODE = config.debugMode;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const url = `${MOCK_BACKEND_URL}/trips`;
        if (DEBUG_MODE) console.log("🔄 Fetching trips from:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: Trip[] = await response.json();
        if (DEBUG_MODE) {
          console.log("✅ Trips loaded:", data.length, "trips");
          console.log("📊 Trips data:", data);
        }
        setTrips(data);
        setError(null);
      } catch (err: any) {
        console.error("❌ Error fetching trips:", err.message || err);
        setError(err.message || "Erreur de connexion au serveur");
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [MOCK_BACKEND_URL, DEBUG_MODE]);

  return (
    <View style={styles.tripsContainer}>
      <Text style={styles.tripsTitle}>🌍 Trips from Mock Backend</Text>
      {loading && <ActivityIndicator size="large" color="#628bee" />}
      {error && <Text style={styles.errorText}>Erreur: {error}</Text>}
      {!loading && trips.length === 0 && !error && (
        <Text style={styles.emptyText}>Aucun voyage disponible</Text>
      )}
      {!loading && trips.length > 0 && (
        <FlatList
          scrollEnabled={false}
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tripCard}>
              <Text style={styles.tripTitle}>{item.title}</Text>
              <Text style={styles.tripDestination}>📍 {item.destination}</Text>
              <Text style={styles.tripDate}>📅 {item.startDate} - {item.endDate}</Text>
              <Text style={styles.tripDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const JSONPLACEHOLDER_URL = config.jsonplaceholderUrl;
  const DEBUG_MODE = config.debugMode;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = `${JSONPLACEHOLDER_URL}/users`;
        if (DEBUG_MODE) console.log("🔄 Fetching users from:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data: User[] = await response.json();
        if (DEBUG_MODE) {
          console.log("✅ Fetch OK:", data.length, "users");
          console.log("📊 Users data:", data);
        }
        setUsers(data);
      } catch (err: any) {
        console.error("❌ Fetch Error:", err.message || err);
        console.warn("💡 Note: Ensure you have internet connection and firewall allows HTTPS requests");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [JSONPLACEHOLDER_URL, DEBUG_MODE]);

  return (
    <View>
      {
        loading ? <ActivityIndicator size="large" /> :
          <FlatList
            scrollEnabled={false}
            data={users}
            renderItem={({ item }) => (
              <View><Text>{item.name}</Text></View>
            )} />
      }
    </View>
  )
}


export default function TabTwoScreen() {


  const name = "Odi";
  const [getCount, setCount] = useState(0);
  const increment = () => {
    setCount(getCount + 1);
    console.log('count', getCount);
  };
  const decrement = () => {
    setCount(getCount - 1);
    console.log('count', getCount);
  };



  return (
    <SafeAreaView style={{ backgroundColor: '#f9f9f9', flex: 1, flexDirection: 'column', gap: 10 }} >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', padding: 15 }}>Hello {name} 👋</Text>
        
        <View style={{ paddingHorizontal: 15 }}>
          <Text style={{ color: '#333', marginBottom: 10 }}>Counter: {getCount}</Text>
          <Button onPress={increment} title="Increment ⬆️" />
          <Button onPress={decrement} title="Decrement ⬇️" />
        </View>

        <View style={{ marginHorizontal: 15, marginTop: 20 }}>
          <Text style={{ color: '#333', fontSize: 16, fontWeight: '600', marginBottom: 10 }}>API Tests</Text>
          <TripsList />
          <UserList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title : {
    fontSize: 28,
    fontWeight: 'bold',
    padding : 20,
    backgroundColor: 'white',
  },
  productList: {
    flex: 1,
    padding: 15,
  },
  summary: {
    backgroundColor: 'white',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666'
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  checkoutButton: {
    backgroundColor: '#628bee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  checkoutButtonDisabled: {
    backgroundColor: '#cbd5e0', 
  },
  checkoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600'
  },
  price: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  button: {
    backgroundColor: '#628bee',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tripsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  tripsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  tripCard: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#628bee',
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  tripDestination: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  tripDescription: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
});
