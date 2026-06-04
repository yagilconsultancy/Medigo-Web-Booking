import { Skeleton } from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';
import React from 'react';

const GOOGLE_MAP_LIBRARIES: ('places' | 'maps' | 'routes')[] = [
  'places',
  'maps',
  'routes',
];

export function AppGoogleMapsProvider({
  apiKey,
  children,
}: {
  apiKey: string;
  children: React.ReactNode;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAP_LIBRARIES,
    version: 'beta', // Use beta to get access to new Places API
  });

  if (!isLoaded) return <Skeleton sx={{ height: '400px', width: '100%' }} />;

  return <>{children}</>;
}
