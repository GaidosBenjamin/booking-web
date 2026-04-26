import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { BookingFlowProvider } from './store/bookingFlow';
import { ToastProvider } from './components/ToastProvider';
import { router } from './router/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingFlowProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </BookingFlowProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
