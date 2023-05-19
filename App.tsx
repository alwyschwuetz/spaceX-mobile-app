import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootSiblingParent } from 'react-native-root-siblings';
import Onboarding from 'react-native-onboarding-swiper';
import { useState } from 'react';
import { StyleSheet, Image} from 'react-native';
import Home from './src/Home';
import Data1 from './src/Detail/Data1';
import Data2 from './src/Detail/Data2';
import Data3 from './src/Detail/Data3';
import Data4 from './src/Detail/Data4';

//Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://main--spacex-l4uc6p.apollographos.net/graphql',
  cache: new InMemoryCache(),
});

const Stack = createNativeStackNavigator()

export default function App() {
  
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboarding = () => {
    setShowOnboarding(false);
  };
  
  return (
    <>
      {/* enable access to apollo client in all the wrapped component */}
      <ApolloProvider client={client}>
        <RootSiblingParent>
          <NavigationContainer>

          {showOnboarding ? (
              <Onboarding
                onDone={handleOnboarding}
                pages={[
                  {
                    backgroundColor: '#6F84C5',
                    image: <Image source={require('./assets/images/onboarding.jpg')} style={styles.image} />,
                    title: 'SpaceX',
                    subtitle: 'Continue to see all the rockets information',
                    titleStyles: { color: 'black', fontSize: 24 },
                    subTitleStyles: { color: 'black', fontSize: 16 },
                  }
                ]}
              />
            ) : (
            <Stack.Navigator initialRouteName="Home" >
              <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
              <Stack.Screen name="Data1" component={Data1}  options={{ headerShown: false }}/>
              <Stack.Screen name="Data2" component={Data2}  options={{ headerShown: false }}/>
              <Stack.Screen name="Data3" component={Data3}  options={{ headerShown: false }}/>
              <Stack.Screen name="Data4" component={Data4}  options={{ headerShown: false }}/>
            </Stack.Navigator>)}

          </NavigationContainer>
        </RootSiblingParent>
      </ApolloProvider>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
  },
});