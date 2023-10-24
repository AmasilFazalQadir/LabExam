import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApiComponent = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const savedData = await AsyncStorage.getItem('bitcoinData');

        if (savedData) {
          
          setData(JSON.parse(savedData));
          setIsLoading(false);
        } else {
          const apiUrl = 'https://api.coindesk.com/v1/bpi/currentprice.json';

          fetch(apiUrl)
            .then((response) => response.json())
            .then((jsonData) => {
              
              AsyncStorage.setItem('bitcoinData', JSON.stringify(jsonData.bpi));
              setData(jsonData.bpi);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
        }
      } catch (error) {
        console.error('AsyncStorage error:', error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Records:</Text>
      <FlatList
        data={Object.entries(data)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: 'blue' }}>
            <Text>{item[0]}</Text>
            <Text>Symbol: {item[1].symbol}</Text>
            <Text>Rate: {item[1].rate}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ApiComponent;
