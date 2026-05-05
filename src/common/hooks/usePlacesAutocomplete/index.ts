'use client';

import { useEffect, useRef, useState } from 'react';

export type PlacePrediction = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

type UsePlacesAutocompleteReturn = {
  predictions: PlacePrediction[];
  clearPredictions: () => void;
  isLoading: boolean;
};

export function usePlacesAutocomplete(
  inputValue: string,
  debounceMs = 300
): UsePlacesAutocompleteReturn {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const sessionTokenRef = useRef<any>(null);
  const cacheRef = useRef<Record<string, PlacePrediction[]>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!(window as any).google?.maps?.places) return;
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new (
        window as any
      ).google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (
      typeof window === 'undefined' ||
      !(window as any).google?.maps?.places
    ) {
      setPredictions([]);
      setIsLoading(false);
      return;
    }

    if (inputValue.length < 3) {
      setPredictions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    timeoutRef.current = window.setTimeout(async () => {
      if (cacheRef.current[inputValue]) {
        setPredictions(cacheRef.current[inputValue]);
        setIsLoading(false);
        return;
      }

      try {
        const { suggestions } = await (
          window as any
        ).google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          {
            input: inputValue,
            sessionToken: sessionTokenRef.current,
          }
        );

        const placePredictions: PlacePrediction[] = (suggestions ?? [])
          .filter((s: any) => 'placePrediction' in s)
          .map(({ placePrediction }: any) => ({
            placeId: placePrediction.placeId,
            description: placePrediction.text.text,
            mainText: placePrediction.mainText?.text ?? '',
            secondaryText: placePrediction.secondaryText?.text ?? '',
          }));

        cacheRef.current[inputValue] = placePredictions;
        setPredictions(placePredictions);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Places autocomplete error:', err);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, debounceMs]);

  const clearPredictions = () => {
    setPredictions([]);
    cacheRef.current = {};
    if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
      sessionTokenRef.current = new (
        window as any
      ).google.maps.places.AutocompleteSessionToken();
    } else {
      sessionTokenRef.current = null;
    }
  };

  return { predictions, clearPredictions, isLoading };
}
