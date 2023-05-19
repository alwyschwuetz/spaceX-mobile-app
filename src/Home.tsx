import React, {useState} from 'react';
import { StatusBar, TextInput, Pressable, StyleSheet, View, Image, Text, ScrollView, ImageBackground, Button } from "react-native";
import { useQuery, gql } from '@apollo/client';
import images from './Image';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-root-toast';

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
      description
    }
  }`

function Home() {

    //retrieve data 
    const { loading, error, data } = useQuery(GET_ROCKET)

    const [isOpen, setIsOpen] = useState(false)
    const [filteredData, setFilteredData] = useState<Rocket[]>([])
    const [selectedFilter, setSelectedFilter] = useState('')
    const [filterName, setFilterName] = useState('Filter')

    //define toast 
    const showToast = () => Toast.show('Select a filter first to search', toastConfig)
    const toastConfig= {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
    }

    //StackNavigationProp specifies navigation type
    //RootStackParamList is the screen type
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Data1' | 'Data2' | 'Data3' | 'Data4'>>()

    const toggleDropdown = () => {
      setIsOpen(!isOpen)
      setFilterName('Filter')      
    }

    const selectFilter = (filter: string) => {
      setSelectedFilter(filter)
      setIsOpen(false)
    }

    const searchHandler = (text: string) => {

      // setSearch(text)

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

    console.log(filteredData)

  //Loading state handling
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.stateText}>Loading...</Text>
      </View>
    )}
  
  //Error state handling
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.stateText}>
          Error: There is a problem retrieving data
        </Text>
      </View>
        )}
  
  //Success state handling
  if (data) {

    const background = require('./images/main_background.png')

    return (
      <View style={styles.container}>
       <ImageBackground source={background} style={styles.imageBackground} >
        
        <StatusBar barStyle="light-content" translucent={true}/>

          {/* Search bar */}
          <View style={styles.search}>

            <TextInput style={styles.inputContainer} placeholder='Search' onChangeText={text => searchHandler(text)}/>

          </View>
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

          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>

            { (filteredData.length > 0 ? filteredData : data.rockets).map((rocket: Rocket) => {

              //verify id to img
              const imageId = images.find((img) => img.id === rocket.id);
            
              //filter the pages to navigate 
              const onPressHandler = () => {
          
              if(rocket.id === "5e9d0d95eda69955f709d1eb") {
                navigation.navigate('Data1')
              }
              else if (rocket.id === "5e9d0d95eda69973a809d1ec") {
                navigation.navigate('Data2')
              }
              else if (rocket.id === "5e9d0d95eda69974db09d1ed") {
                navigation.navigate('Data3')
              }
              else if (rocket.id === "5e9d0d96eda699382d09d1ee") {
                navigation.navigate('Data4')
              }
            }

              return (
                // Individual card display
                <View key={rocket.id} style={styles.card}>
                  
                  {/* passing in rocket id to detail page */}
                  <Pressable onPress={() => onPressHandler()}>

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
              )
            })}
            
          </ScrollView>
          </ImageBackground>
      </View>
  )}
  //returns null if no condition is met
  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stateText: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    marginTop: '50%'
  },
  filterButton: {
    position: 'absolute',
    marginTop: 55,
    borderRadius: 20,
    zIndex: 1, // Ensure the button is rendered above other elements
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
    fontSize: 17,
    fontFamily: 'Helvetica',
    textAlign: 'left',
    marginBottom: 5,
  },
});

export default Home