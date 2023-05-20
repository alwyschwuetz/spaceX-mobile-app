import { useQuery, gql } from '@apollo/client';
import React, {useState, useEffect} from 'react';
import { StatusBar, ActivityIndicator, StyleSheet, View, Text, Button, ScrollView, ImageBackground, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Asset } from 'expo-asset';

//define 1 screen
type RootStackParamList = {
    Home: undefined,
  };


const GET_DETAILS = gql`
query Rockets {
    rockets {
      id
      active
      name
      country
      company
      cost_per_launch
      success_rate_pct
      first_flight
      mass {
        kg
      }
      height {
        meters
      }
      description
      wikipedia
    }
  }`

function Data4() {
   //to use navigation
   const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>()

    //retrieve data 
    const { loading, error, data } = useQuery(GET_DETAILS);

    const [isLoadingComplete, setLoadingComplete] = useState(false);

     //load image properly
    useEffect(() => {
      async function loadResourcesAsync() {
        await Asset.loadAsync([require('../../assets/images/detail_background.jpg')]);
      }
  
      async function loadResourcesAndDataAsync() {
        try {
          await loadResourcesAsync();
          setLoadingComplete(true);
        } catch (e) {
          console.warn(e);
        }
      }
  
      loadResourcesAndDataAsync();
    }, []);
  
    if (!isLoadingComplete) {
      return null;
    }

    //sending to wiki link
    const onPressHandler = () => {
      Linking.openURL('https://en.wikipedia.org/wiki/SpaceX_Starship')
    }

        //Loading state handler
       if(loading) {
        return (
          <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/detail_background.jpg')} style={styles.imageBackground} >
              <Text style={styles.stateText}>Loading...</Text>

              <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator size="large" color="#6F84C5" />
              </View>

            </ImageBackground>
          </View>
      )}

      //Error state handler
      if(error) {
        return (
          <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/detail_background.jpg')} style={styles.imageBackground} >
              <Text style={styles.stateText}>
                Error: There is a problem retrieving data
              </Text>
            </ImageBackground>
          </View>
      )}

      if(data) {

        //using the fourth data in query
        const newRocket = data.rockets[3]

        return(
          <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/detail_background.jpg')} style={styles.imageBackground}>
            <StatusBar barStyle="light-content" />

            <View style={styles.cardContainer}>
              <ScrollView showsVerticalScrollIndicator={false} >
                  
                <View style={styles.card} >
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>Full Details 🚀</Text>
                  </View>
                      
                  <View style={styles.cardDetails} >
                    <Text style={styles.text}>Rocket ID: {newRocket.id} {"\n"}</Text>
                    <Text style={styles.text}>Active: {newRocket.active? "True" : "False"}{"\n"} </Text>
                    <Text style={styles.text}>Rocket Name: {newRocket.name}{"\n"}</Text>
                    <Text style={styles.text}>First Flight: {newRocket.first_flight}{"\n"}</Text>
                    <Text style={styles.text}>Country: {newRocket.country}{"\n"}</Text>
                    <Text style={styles.text}>Company: {newRocket.company}{"\n"}</Text>
                    <Text style={styles.text}>Cost Per Launch: US${newRocket.cost_per_launch}{"\n"}</Text>
                    <Text style={styles.text}>Success Rate: {newRocket.success_rate_pct}%{"\n"}</Text>
                    <Text style={styles.text}>Mass: {newRocket.mass.kg} kilograms{"\n"}</Text>
                    <Text style={styles.text}>Height: {newRocket.height.meters} meters{"\n"}</Text>
                    <Text style={styles.text}>Description: {newRocket.description}{"\n"}</Text>
                        
                   <Text style={styles.text}>Wikipedia</Text>
                    <TouchableOpacity onPress={onPressHandler}>
                      <Text style={styles.text}>{newRocket.wikipedia}</Text>
                    </TouchableOpacity>

                  </View>

                <View style={styles.button}>
                  <Button title='Back Home' onPress={() => navigation.navigate("Home") }/>
                </View>
                    
                </View>
              </ScrollView>
            </View>
            </ImageBackground>
          </View>
          )
      }
    return null
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    activityIndicatorContainer: {
      marginTop: 40,
    },
    stateText: {
      fontSize: 40,
      color: 'white',
      textAlign: 'center',
      marginTop: '60%'
    },
    imageBackground: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    cardContainer: {
      flex: 1,
      marginTop: 50,
      marginBottom: 30,
      marginLeft: 25,
      marginRight: 25,
      borderRadius: 30,
      overflow: 'hidden',
    },
    card: {
      width: '100%',
      height: '100%',
      borderRadius: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    cardDetails: {
      padding: 10,
    },
    text: {
      color: 'black',
      fontSize: 18,
      fontFamily: 'Helvetica',
      textAlign: 'left',
      marginBottom: 5,
      lineHeight: 22
    },
    titleContainer:{
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: '',
      borderBottomWidth: 1.5,
      borderBottomColor: 'black',
    },
    title: {
      fontSize: 30,
      textAlign: 'center',
      fontFamily: 'Helvetica',
      color: 'black',
      padding: 20
    },
    button: {
      borderRadius: 50,
      color: 'black',
      marginBottom: 10,
      marginHorizontal: '30%'
    }
  })

  export default Data4