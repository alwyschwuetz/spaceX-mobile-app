import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootSiblingParent } from 'react-native-root-siblings';
import Onboarding from 'react-native-onboarding-swiper';
import { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator} from 'react-native';
import { Asset } from 'expo-asset';
import Home from './src/Home';
import Data1 from './src/Detail/Data1';
import Data2 from './src/Detail/Data2';
import Data3 from './src/Detail/Data3';
import Data4 from './src/Detail/Data4';
import { Image } from 'expo-image';

  //Initialize Apollo Client
  const client = new ApolloClient({
    uri: 'https://main--spacex-l4uc6p.apollographos.net/graphql',
    cache: new InMemoryCache(),
  });

  const Stack = createNativeStackNavigator()

export default function App() {
  
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isImageLoading, setImageLoading] = useState(true);
  
  useEffect(() => {
    const loadImage = async () => {
      try {
        await Asset.loadAsync(require('./assets/images/onboarding.jpg'));
        setImageLoading(false);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };
  
    loadImage();
  }, []);

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
                skipLabel="" // Empty string to remove the "Skip" label
                pages={[
                  {
                    backgroundColor: '#6F84C5',
                    image: isImageLoading ? (
                      <ActivityIndicator size="large" color="white" />
                    ) : (
                      <Image
                        source={require('./assets/images/onboarding.jpg')}
                        style={styles.image}
                      />),
                    title: 'SpaceX',
                    subtitle: 'Continue to use the app',
                    titleStyles: { color: 'black', fontSize: 24 },
                    subTitleStyles: { color: 'black', fontSize: 16 },
                  },
                  {
                    backgroundColor: '#6F84C5',
                    image: isImageLoading ? (
                      <ActivityIndicator size="large" color="white" />
                    ) : (
                      <Image
                        source={require('./assets/images/onboard2.jpg')}
                        style={styles.image}
                      />),
                    title: 'Home Screen',
                    subtitle: 'Swipe left to see more content',
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