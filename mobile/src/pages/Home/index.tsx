import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, Text, StyleSheet, ImageBackground, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import * as IBGEApi from '../../services/IBGEApi';

import logo from '../../assets/logo.png';
import background from '../../assets/home-background.png';

interface ISelectedAdress {
  uf: string;
  city: string;
}

interface ISelect {
  label: string;
  value: any;
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<ISelect[]>([]);
  const [citys, setCitys] = useState<ISelect[]>([]);

  const [selectedAdressData, setSelectedAdressData] = useState<ISelectedAdress>({
    city: '',
    uf: '',
  });

  useEffect(() => {
    IBGEApi.getUFs().then((ResponseUfs) => {
      const ufsSerialized = ResponseUfs.map((uf) => ({
        label: uf.sigla,
        value: uf.sigla,
      })).sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0)); // ordena pelo alfabeto

      setUfs([...ufsSerialized]);
    });
  }, []);

  function handleNavigationToPoints() {
    if (!selectedAdressData.uf || !selectedAdressData.city) {
      return Alert.alert('Ops', 'Selecione uma UF e uma Cidade');
    }
    navigation.navigate('Points', selectedAdressData);
  }

  function handleSetSelectData({ field, value }: { field: 'uf' | 'city'; value: string }) {
    if (field === 'uf') {
      IBGEApi.getMunicipios(value).then((responseCitys) => {
        const citySerialized = responseCitys.map((city) => ({
          value: city.nome,
          label: city.nome,
        }));

        setCitys(citySerialized);
      });
    }

    setSelectedAdressData({ ...selectedAdressData, [field]: value });
  }

  if (!ufs.length) {
    return null;
  }

  return (
    <ImageBackground
      style={styles.container}
      source={background}
      imageStyle={{
        width: 274,
        height: 368,
      }}
    >
      <View style={styles.main}>
        <Image source={logo} />
        <Text style={styles.title}>Seu marketplace de coleta de residuos.</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View>
        <RNPickerSelect
          style={{
            inputAndroid: { ...styles.input },
            inputIOS: { ...styles.input },
          }}
          useNativeAndroidPickerStyle={false}
          key="selectUF"
          placeholder={{ label: 'UF', value: null, color: '#D0D0D0' }}
          onValueChange={(uf) => handleSetSelectData({ value: uf, field: 'uf' })}
          items={ufs}
        />

        <RNPickerSelect
          key="selectCity"
          style={{
            inputAndroid: { ...styles.input },
            inputIOS: { ...styles.input },
            viewContainer: { height: 40 },
          }}
          value={selectedAdressData.city ? selectedAdressData.city : ''}
          onValueChange={(city) => handleSetSelectData({ value: city, field: 'city' })}
          useNativeAndroidPickerStyle={false}
          disabled={!selectedAdressData.uf}
          placeholder={{ label: 'Cidade', value: null, color: '#D0D0D0' }}
          onOpen={
            !selectedAdressData.uf
              ? () => Alert.alert('UF não selecionada!', 'Selecione uma UF!')
              : () => {
                  /**/
                }
          }
          items={citys}
        />
      </View>

      <View style={styles.footer}>
        <RectButton onPress={handleNavigationToPoints} style={styles.button}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="white" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

export default Home;
