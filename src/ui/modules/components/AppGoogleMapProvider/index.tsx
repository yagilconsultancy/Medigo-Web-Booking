import { useJsApiLoader } from '@react-google-maps/api';
import React from 'react';

export function AppGoogleMapsProvider({
  apiKey,
  children,
}: {
  apiKey: string;
  children: React.ReactNode;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['places', 'maps', 'routes'], // Added 'routes' for directions
    version: 'beta', // Use beta to get access to new Places API
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <>{children}</>;
}
