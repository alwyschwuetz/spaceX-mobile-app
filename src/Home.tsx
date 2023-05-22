import React, {useEffect, useState} from 'react';
import { 
  StatusBar, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  View, 
  Image, 
  FlatList, 
  Text, 
  ImageBackground, 
  Button } from "react-native";
import { useQuery, gql } from '@apollo/client';
import ImageUrl from './ImageUrl';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-root-toast';
import { Asset } from 'expo-asset';
import Icon  from 'react-native-vector-icons/FontAwesome';

//define data type
type Rocket = {
  id: string,
  name: string,      
  country: string,
  first_flight: string,
}

//define 4 screen name
type RootStackParamList = {
  Data1: undefined,
  Data4: undefined,
  Data2: undefined,
  Data3: undefined,
}

//define query wanted
const GET_ROCKET = gql`
query Rockets {
  rockets {
    id
    active
    name
    country
    company
    cost_per_launch
    first_flight
    success_rate_pct
    mass {
      kg
    }
    height {
      meters
    }
    description
    wikipedia
  }}`

function Home() {

    //StackNavigationProp specifies navigation type
    //RootStackParamList is the screen type
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Data1' | 'Data2' | 'Data3' | 'Data4'>>()

    //retrieve data 
    const { loading, error, data} = useQuery(GET_ROCKET)

    //useState hooks
    const [isOpen, setIsOpen] = useState(false)
    const [sortedData, setSortedData] = useState<Rocket[]>([])
    const [sortingEnabled, setSortingEnabled] = useState(false)
    const [isLoadingComplete, setLoadingComplete] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [page, setPage] = useState(0)
    const pageSize = 1

    //load background image faster
    useEffect(() => {
      async function loadResourcesAsync() {
        await Asset.loadAsync([require('../assets/images/main_background.jpg')])
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

    //Search text from input
    const searchHandler = (text: string) => {
      const searchValue = (value: any, text: string) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(text.toLowerCase())
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          return value.toString().includes(text.toLowerCase())
        } else if (typeof value === 'object') {
          for (const key in value) {
            if (searchValue(value[key], text)) {
              return true
            }
          }
        }
        return false
      }

      const searchedData = data.rockets.filter((rocket: Rocket) => {
        return searchValue(rocket, text)
      })

      setSortedData(searchedData)
      setPage(0)
      
      //Toast for no search results
      if (searchedData.length === 0) {
        Toast.show('No results found', {
          position: Toast.positions.CENTER,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          textColor: 'black',
          shadowColor: 'transparent'
        })
      }    
    }

  //Loading state handler
  if (loading) {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/images/main_background.jpg')} style={styles.imageBackground} >
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        </ImageBackground>
      </View>
    )
  }
  
  //Error state handler
  if (error) {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/images/main_background.jpg')} style={styles.imageBackground} >
          <Text style={styles.stateText}>
            Error: There is a problem retrieving data
          </Text>
        </ImageBackground>
      </View>
    )
  }
  
  //Success state handling
  if (data) {
    //RocketItemProps defines the props for the RocketItem component
    type RocketItemProps = {
      rocket: Rocket
    }

    //Function to sort rockets by name in ascending order
    const sortRocketsByNameAscending = () => {
      const sortedData = [...data.rockets].sort((a, b) => a.name.localeCompare(b.name))
      setSortedData(sortedData)
      setSortingEnabled(true)
      setIsOpen(false)
    }

    //Function to sort rockets by name in descending order
    const sortRocketsByNameDescending = () => {
      const sortedData = [...data.rockets].sort((a, b) => b.name.localeCompare(a.name))
      setSortedData(sortedData)
      setSortingEnabled(true)
      setIsOpen(false)
    }

    //Calculate the total number of pages based on the data length and page size
    const totalPages = Math.ceil((sortingEnabled ? sortedData.length : data?.rockets.length || 0) / pageSize)

    //Previous and Next Page Functions
    const loadMoreItems = () => {    
      if (page < totalPages - 1) {
        setPage(page + 1)
      }
    }
    const loadPrevItems = () => {
      if (page > 0) {
        setPage(page - 1)
      }
    }

    //RocketItem function for flatlist rendering
    const RocketItem = ({ rocket }: RocketItemProps) => {
      // Verify id to img
      const imageId = ImageUrl.find((img) => img.id === rocket.id)
  
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
      }
    
      return (
        <View style={styles.card}>
          {imageId && (
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: imageId.url }} />
            </View>
          )}
          
          <View style={styles.cardContentBubble}>
            <Text style={styles.cardText2}>{rocket.name}</Text>
            <Text style={styles.cardText2}>{rocket.country}</Text>
          </View>
    
          <View style={styles.cardDetails}>
            <View style={styles.cardContent}>
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

          <View style={styles.search}>
            <TextInput style={styles.inputContainer} placeholder='Search' value={searchText} onChangeText={text => {setSearchText(text); searchHandler(text)}}/>
          </View>

            <View style={styles.sortButton}>
              <Button title="Sort" onPress={() => {setIsOpen(!isOpen)}} />
              {isOpen && (
                <View>
                  <Button title='A-Z' onPress={() => {sortRocketsByNameAscending(); setSearchText('')}}/>
                  <Button title='Z-A' onPress={() => {sortRocketsByNameDescending(); setSearchText('')}}/>
                </View>
              )}
            </View>

          <FlatList
            data={
            sortingEnabled
              ? sortedData.slice(page * pageSize, (page + 1) * pageSize)
              : sortedData.length > 0
              ? sortedData.slice(page * pageSize, (page + 1) * pageSize)
              : data.rockets.slice(page * pageSize, (page + 1) * pageSize)
            }
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RocketItem rocket={item} />}
            horizontal={true}
          />

          <View style={styles.pageBtnContainer}>
            <TouchableOpacity style={styles.pageBtn} onPress={loadPrevItems} disabled={page === 0 || loading}>
              <View style={styles.buttonContent}>
                <Icon name="chevron-left" size={20} color="black" />
              </View>
            </TouchableOpacity>

            <Text style={styles.buttonText}>{page + 1}</Text>

            <TouchableOpacity style={styles.pageBtn} onPress={loadMoreItems} disabled={loading || page === totalPages - 1}>
              <View style={styles.buttonContent}>
                <Icon name="chevron-right" size={20} color="black" />
              </View>
            </TouchableOpacity>
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
    alignContent: 'center',
    marginTop: '90%'
  },
  stateText: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
    marginTop: '60%'
  },
  sortButton: {
    position: 'absolute',
    marginTop: 64,
    borderRadius: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    marginLeft: '54%',
    width: '13%',
    overflow: 'scroll',
  },
  search: {
    marginTop: 60,
    marginLeft: 30,
    marginRight: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  inputContainer: {
    marginHorizontal: 5,
    width: '94%',
    padding: 15,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pageBtnContainer: {
    paddingHorizontal: 50,
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
  pageBtn: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMoreButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#6F84C5',
    color: 'white',
    textAlign: 'center',
  },
  infoButton: {
    marginTop: 5,
    borderTopColor: 'white',
    borderTopWidth: 1,
  },
  card: {
    width: 335,
    borderRadius: 30,
    marginHorizontal: 10,
    marginLeft: 27,
    marginRight: 27,
    marginTop: 70,
    marginBottom: '20%',
  },
  imageContainer: {
    width: '100%',
    height: '80%',
    overflow: 'hidden',
    borderRadius: 30
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardDetails: {
    padding: 20,
    marginTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 30,
    alignContent: 'center',
    height: '20%'
  },
  cardContent: {
    marginBottom: 10,
  },
  cardContentBubble: {
    marginTop: -60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 10,
  },
  text: {
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 5,
  },
  cardText2: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

export default Home