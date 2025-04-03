import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Vehicle Tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
