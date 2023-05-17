import { useQuery, gql } from '@apollo/client';
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type Info= {
    id: string,
    active: boolean,
    name: string,
    country: string,
    company: string,
    cost_per_launch: number,
    success_rate_pct: number,
    mass: {
        kg: number
    },
    height: {
        meters: number
    },
    description: string,
    wikipedia: any
  }

//define screen type
type RootStackParamList = {
    Home: undefined;
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

function Details() {
    //retrieve data 
    const { loading, error, data } = useQuery(GET_DETAILS);

    //to use navigation
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>()

    if (loading) {
        return (
          <View >
            <Text>Loading...</Text>
          </View>
        );}
    
      if (error) {
        return (
          <View >
            <Text>
              Error: There is a problem retrieving data
            </Text>
          </View>
            );}

        if(data) {
            console.log()
            return(
                <SafeAreaView>
                    <ScrollView showsHorizontalScrollIndicator={false} >

                        {data.rockets.map((detail: Info) => {
                            return(
                                <View key={detail.id}>
                                    <Text>{detail.id}</Text>
                                    <Text> {detail.active} </Text>
                                    <Text>{detail.name}</Text>

                                        <Pressable onPress={() => navigation.navigate("Home") }>
                                        <Text>Close</Text>
                                        </Pressable>

                                </View>
                            )
                        })}

                    </ScrollView>
                </SafeAreaView>
            )
        }
        return null
  }

  export default Details