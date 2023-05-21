import React, {useEffect, useState} from 'react';
import { StatusBar, ActivityIndicator, TouchableOpacity, TextInput, Pressable, StyleSheet, View, Image, FlatList, Text, ImageBackground, Button } from "react-native";
import { useQuery, gql } from '@apollo/client';
import images from './Image';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-root-toast';
import { Asset } from 'expo-asset';

//define data type
type Rocket = {
  id: string,
  name: string,      
  country: string,
  first_flight: string,
  description: string,
  }

//define 4 screen name
type RootStackParamList = {
  Data1: undefined,
  Data4: undefined,
  Data2: undefined,
  Data3: undefined,
};

//define query wanted
const GET_ROCKET = gql`
query Rockets {
    rockets {
      id
      name
      country
      first_flight
    }
  }`

   //define toast 
   const toastConfig= {
     duration: Toast.durations.SHORT,
     position: Toast.positions.CENTER,
   }

   const showToast = () => Toast.show('Select a filter first to search', toastConfig)

function Home() {

   //StackNavigationProp specifies navigation type
    //RootStackParamList is the screen type
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Data1' | 'Data2' | 'Data3' | 'Data4'>>()

    const [isOpen, setIsOpen] = useState(false)
    const [filteredData, setFilteredData] = useState<Rocket[]>([])
    const [selectedFilter, setSelectedFilter] = useState('')
    const [filterName, setFilterName] = useState('Filter')
    const [isLoadingComplete, setLoadingComplete] = useState(false)

    //retrieve data 
    const { loading, error, data} = useQuery(GET_ROCKET)

    //load image properly
    useEffect(() => {
      async function loadResourcesAsync() {
        await Asset.loadAsync([require('../assets/images/main_background.jpg')]);
      }
  
      async function loadResourcesAndDataAsync() {
        try {
          await loadResourcesAsync()
          setLoadingComplete(true)
        } catch (e) {
          console.warn(e)
        }
      }
  
      loadResourcesAndDataAsync()
    }, [])
  
    if (!isLoadingComplete) {
      return null
    }

    const toggleDropdown = () => {
      setIsOpen(!isOpen)
      setFilterName('Filter')      
    }

    //filter the clicked button
    const selectFilter = (filter: string) => {
      setSelectedFilter(filter)
      setIsOpen(false)
    }

    //search the text from input
    const searchHandler = (text: string) => {

      if (text !== '' && filterName ==='Filter') {
        showToast();
        return;
      }
      
      // Filter the data based on the selected filter type and search text
      const filteredItems = data.rockets.filter((prop: { name: string, country: string, first_flight: string, description: string }) => {
        const newSearch = text.toLowerCase()
        switch (selectedFilter) {
          case 'Name':
            return prop.name.toLowerCase().includes(newSearch)
          case 'Country':
            return prop.country.toLowerCase().includes(newSearch)
          case 'First Flight':
            return prop.first_flight.toLowerCase().toString().includes(newSearch)
          case 'Description':
            return prop.description.toLowerCase().includes(newSearch)
          default:
            return false;
        }
      })
    
      setFilteredData(filteredItems)
    }

  //Loading state handler
  if (loading) {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/images/main_background.jpg')} style={styles.imageBackground} >
        <Text style={styles.stateText}>Loading...</Text>
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#6F84C5" />
        </View>
        </ImageBackground>
      </View>
    )}
  
  //Error state handler
  if (error) {
    console.log(error)
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/images/main_background.jpg')} style={styles.imageBackground} >
        <Text style={styles.stateText}>
          Error: There is a problem retrieving data
        </Text>
        </ImageBackground>
      </View>
        )}
  
  //Success state handling
  if (data) {

    type RocketItemProps = {
      rocket: Rocket
    };

    const RocketItem = ({ rocket }: RocketItemProps) => {
      // Verify id to img
      const imageId = images.find((img) => img.id === rocket.id)
  
      // Filter the pages to navigate
      const onPressHandler = () => {
        if (rocket.id === "5e9d0d95eda69955f709d1eb") {
          navigation.navigate('Data1')
        } else if (rocket.id === "5e9d0d95eda69973a809d1ec") {
          navigation.navigate('Data2')
        } else if (rocket.id === "5e9d0d95eda69974db09d1ed") {
          navigation.navigate('Data3')
        } else if (rocket.id === "5e9d0d96eda699382d09d1ee") {
          navigation.navigate('Data4')
        }
      };
    
      return (
        <View style={styles.card}>
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

              <View  style={styles.infoButton}>
                <Button title="More info" onPress={onPressHandler} color={'white'}/>
              </View>

            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>
       <ImageBackground source={require('../assets/images/main_background.jpg')} style={styles.imageBackground} >
        
        <StatusBar barStyle="light-content" translucent={true}/>

          {/* Search bar */}
          <View style={styles.search}>
            <TextInput style={styles.inputContainer} placeholder='Search' onChangeText={text => searchHandler(text)}/>
          </View>
              {/* filter buttons */}
              <View style={styles.filterButton}>
                <Button title={filterName} onPress={toggleDropdown} />
                {isOpen && (
                <View>
                  <Button title='Name' onPress={() => {selectFilter('Name') ; setFilterName('Name')}}/>
                  <Button title='Country' onPress={() => {selectFilter('Country'); setFilterName('Country')}}/>
                  <Button title='First Flight' onPress={() => {selectFilter('First Flight'); setFilterName('First Flight')}}/>
                  <Button title='Description'  onPress={() => {selectFilter('Description'); setFilterName('Description')}}/>
                </View>
                )}
              </View>
                  
            <FlatList
              data={filteredData.length > 0 ? filteredData : data.rockets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <RocketItem rocket={item} />}
              horizontal={true}
            />

          </ImageBackground>
      </View>
  )}
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
  filterButton: {
    position: 'absolute',
    marginTop: 55,
    borderRadius: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    marginLeft: '55%',
    width: 30,
    overflow: 'scroll',
  },
  search: {
    marginTop: 50,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  inputContainer: {
    marginHorizontal: 5,
    width: '53%',
    padding: 15
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pageBtnContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  showMoreButton: {
marginVertical: 10,
    padding: 10,
    backgroundColor: '#6F84C5',
    color: 'white',
    textAlign: 'center',
  },
  infoButton: {
    // borderRadius: 100,
    // width: 43,
    // borderColor: 'white',
    // borderWidth: 2,
    // height: 
  },
  card: {
    width: 335,
    borderRadius: 30,
    marginHorizontal: 10,
    marginLeft: 27,
    marginRight: 27,
    marginTop: 20,
    marginBottom: 27,
    // backgroundColor: 'rgba(78, 110, 129, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  imageContainer: {
    width: '100%',
    height: 0,
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
    fontSize: 17,
    fontFamily: 'Helvetica',
    textAlign: 'left',
    marginBottom: 5,
  },
});

export default Home