import React from 'react';
import { Pressable, StyleSheet, View, Image, Text, ScrollView, SafeAreaView } from "react-native"
import { useQuery, gql } from '@apollo/client';
import images from './Image';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

//define data type
type Rocket = {
    id: string,
    name: string,
    country: string,
    first_flight: string,
    description: string,
  }

//define screen type
type RootStackParamList = {
  Details: undefined;
};

//define query wanted
const GET_ROCKET = gql`
query Rocket {
  rockets {
    id
    name
    country
    first_flight
    description
  }
}`

function Home() {
    //retrieve data 
    const { loading, error, data } = useQuery(GET_ROCKET);

    //to use navigation
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Details'>>()

  //Loading state handling
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );}
  
  //Error state handling
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Error: There is a problem retrieving data
        </Text>
      </View>
        );}
  
  //Success state handling
  if (data) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>

          {/* map rocket */}
          {data.rockets.map((rocket: Rocket) => {
            //verify id to img
            const imageId = images.find((img) => img.id === rocket.id);

            return (
              
              //Individual card display
              <View key={rocket.id} style={styles.card}>
                <Pressable onPress={() => navigation.navigate("Details") }>

                {/* display web image with uri*/}
                {imageId && (
                  <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: imageId.url }} />
                  </View>
                )}

                <View style={styles.cardDetails}>

                  <View style={styles.cardContent}>
                    <Text style={styles.text}>Name: {rocket.name}</Text>
                    <Text style={styles.text}>Country: {rocket.country}</Text>
                    <Text style={styles.text}>First Flight: {rocket.first_flight}</Text>
                  </View>

                  <View style={styles.cardDescription}>
                    <Text style={styles.text}>Description:{"\n"}{rocket.description}</Text>
                  </View>

                </View>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
  );}
  //returns null if no condition is met
  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 335,
    borderRadius: 30,
    marginHorizontal: 10,
    marginTop: 80,
    backgroundColor: '#4E6E81',
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardDetails: {
    padding: 10,
  },
  cardContent: {
    marginBottom: 10,
  },
  cardDescription: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Helvetica',
    textAlign: 'left',
    marginBottom: 5,
  },
});

export default Home