import 'react-native-gesture-handler';
import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppProvider } from './src/context/AppContext';
import { colors } from './src/theme/colors';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackScreen } from './src/routes/RootStackScreen';

const AppState = ({ children }: any) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.Primary,
    accent: colors.Primary,
    text: colors.Primary,
  },
};

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <AppState>
          <PaperProvider theme={theme}>
            <RootStackScreen />
          </PaperProvider>
        </AppState>
      </NavigationContainer>
    </QueryClientProvider>
  )
}
