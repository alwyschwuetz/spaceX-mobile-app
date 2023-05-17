import { StyleSheet, View } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/Home';
import Details from './src/Details';

//Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://main--spacex-l4uc6p.apollographos.net/graphql',
  cache: new InMemoryCache(),
});

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <View style={styles.container}>
      {/* enable access to apollo client in all the wrapped component */}
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" >
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
            <Stack.Screen name="Details" component={Details}  options={{ headerShown: false }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#394867',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
});