import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { findCase } from './cases';
import type { RootStackParamList } from './navigation';
import { CaseScreen } from './screens/CaseScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TestScreen } from './screens/TestScreen';
import { NavigationDetailsScreen } from './tests/NavigationFocusTest';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Memo Lab' }}
          />
          <Stack.Screen
            name="Case"
            component={CaseScreen}
            options={({ route }) => ({
              title: findCase(route.params.id).title,
            })}
          />
          <Stack.Screen
            name="Test"
            component={TestScreen}
            options={({ route }) => ({
              title: findCase(route.params.id).title,
            })}
          />
          <Stack.Screen
            name="NavigationDetails"
            component={NavigationDetailsScreen}
            options={{ title: 'Order details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
