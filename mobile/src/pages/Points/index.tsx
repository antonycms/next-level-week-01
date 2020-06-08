import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Map, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import baseApi from '../../services/baseApi';
import * as Location from 'expo-location';

interface IItem {
  id: number;
  title: string;
  image: string;
  url: string;
}

interface IPoint {
  id: 1;
  image: 'fake';
  name: 'Ponto de Teste';
  latitude: -42.012321;
  longitude: -40.020323;
  city: 'Maceio';
  uf: 'AL';
}

interface IAddress {
  uf: string;
  city: string;
}

const Points: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const address = route.params as IAddress;

  const [items, setItems] = useState<IItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [points, setPoints] = useState<IPoint[]>([]);

  const [initialLocation, SetInitialLocation] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    baseApi.get('/items').then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    async function loadLocation() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Oppsss', 'A permissão para acessar a localização é necessaária!');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();

      SetInitialLocation([coords.latitude, coords.longitude]);
    }

    loadLocation();
  }, []);

  useEffect(() => {
    baseApi
      .get('/points', {
        params: {
          uf: address.uf,
          city: address.city,
          items: selectedItems,
        },
      })
      .then((response) => {
        setPoints(response.data);
      });
  }, [selectedItems]);

  if (!points) {
    return <View />;
  }

  function handleToHomePage() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { pointID: id });
  }

  function handleSelectItem(id: number) {
    const idAlreadyAdded = selectedItems.findIndex((item) => item === id);

    if (idAlreadyAdded !== -1) {
      const ArFilteredItemd = selectedItems.filter((item) => item !== id);

      setSelectedItems(ArFilteredItemd);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleToHomePage}>
          <Icon size={20} color="#34cb79" name="arrow-left" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem Vindo</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          {initialLocation[0] === 0 ? (
            <View style={styles.mapLoading}>
              <Text>Carregando Mapa...</Text>
            </View>
          ) : (
            <Map
              initialRegion={{
                latitude: -9.7946377,
                longitude: -36.1002103,
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
              style={styles.map}
            >
              {points.map((point) => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </Map>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map((item) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={String(item.id)}
              onPress={() => handleSelectItem(item.id)}
              style={[styles.item, selectedItems.includes(item.id) ? styles.selectedItem : {}]}
            >
              <SvgUri width={42} height={42} uri={item.url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  mapLoading: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    backgroundColor: '#34CB7915',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;
