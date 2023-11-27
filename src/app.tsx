import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';
import { Navigation } from './ui/navigation';

const client = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={client}>
      <SafeAreaProvider>
        <MenuProvider>
          <Navigation />
        </MenuProvider>
      </SafeAreaProvider>

      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
