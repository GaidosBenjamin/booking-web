import { createBrowserRouter, Navigate } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import VerifyEmailPage from '../pages/VerifyEmail/VerifyEmailPage';
import ForgotPasswordPage from '../pages/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPassword/ResetPasswordPage';
import CodeOfConductPage from '../pages/CodeOfConduct/CodeOfConductPage';
import CampersPage from '../pages/Campers/CampersPage';
import BuildingSelectionPage from '../pages/BuildingSelection/BuildingSelectionPage';
import RoomSelectionPage from '../pages/RoomSelection/RoomSelectionPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import BookingSuccessPage from '../pages/BookingSuccess/BookingSuccessPage';
import BookingFailedPage from '../pages/BookingFailed/BookingFailedPage';
import PrivacyPolicyPage from '../pages/Legal/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/Legal/TermsOfServicePage';
import ContactPage from '../pages/Legal/ContactPage';
import DonationPage from '../pages/Donation/DonationPage';
import DonationSuccessPage from '../pages/Donation/DonationSuccessPage';
import DonationFailedPage from '../pages/Donation/DonationFailedPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/code-of-conduct',
    element: (
      <ProtectedRoute>
        <CodeOfConductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/campers',
    element: (
      <ProtectedRoute>
        <CampersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/campers/:camperId/building',
    element: (
      <ProtectedRoute>
        <BuildingSelectionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/campers/:camperId/room',
    element: (
      <ProtectedRoute>
        <RoomSelectionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/booking/success',
    element: (
      <ProtectedRoute>
        <BookingSuccessPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/booking/failed',
    element: (
      <ProtectedRoute>
        <BookingFailedPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/terms-of-service',
    element: <TermsOfServicePage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/donation',
    element: <DonationPage />,
  },
  {
    path: '/donation/success',
    element: <DonationSuccessPage />,
  },
  {
    path: '/donation/failed',
    element: <DonationFailedPage />,
  },
]);
