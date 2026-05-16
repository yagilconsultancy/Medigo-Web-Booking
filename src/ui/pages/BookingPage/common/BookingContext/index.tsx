'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type BookingAddressState = {
  pickupAddress: string;
  dropoffAddress: string;
  pickupCoordinates: { lat: number; lng: number } | null;
  dropoffCoordinates: { lat: number; lng: number } | null;
};

export type BookingPatientState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  countryIso3: string;
};

export type BookingState = {
  address: BookingAddressState;
  patient: BookingPatientState;
  service: {
    type: 'transport' | 'transport_assistant' | null;
    careAssistantFee: number | null;
    currency: string;
  };
  appointment: {
    type: string | null;
    otherDetails: string;
  };
  vehicle: {
    type: 'standard' | 'wheelchair' | 'stretcher' | null;
    rideType: string | null;
    passengers: number;
    promoCode: string;
    estimatedTotal: number | null;
    currency: string;
  };
  trip: {
    type: 'one_way' | 'round_trip' | null;
    pickupDate: string;
    pickupTime: string;
    isRecurring: boolean;
    recurringFrequency: 'daily' | 'weekly' | 'bi_weekly' | 'monthly' | null;
    recurringDaysOfWeek: number[];
    recurringStartDate: string;
    recurringEnds: 'by_date' | 'no_of_rides';
    recurringEndDate: string;
    recurringRideCount: number | null;
    notes: string;
  };
};

type BookingContextValue = {
  booking: BookingState;
  setAddress: (next: Partial<BookingAddressState>) => void;
  setPatient: (next: Partial<BookingPatientState>) => void;
  setService: (next: Partial<BookingState['service']>) => void;
  setAppointment: (next: Partial<BookingState['appointment']>) => void;
  setVehicle: (next: Partial<BookingState['vehicle']>) => void;
  setTrip: (next: Partial<BookingState['trip']>) => void;
  reset: () => void;
};

const DEFAULT_BOOKING: BookingState = {
  address: {
    pickupAddress: '',
    dropoffAddress: '',
    pickupCoordinates: null,
    dropoffCoordinates: null,
  },
  patient: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    countryCode: '+1',
    countryIso3: 'CAN',
  },
  service: {
    type: null,
    careAssistantFee: null,
    currency: 'CAD',
  },
  appointment: {
    type: null,
    otherDetails: '',
  },
  vehicle: {
    type: null,
    rideType: null,
    passengers: 1,
    promoCode: '',
    estimatedTotal: null,
    currency: 'CAD',
  },
  trip: {
    type: null,
    pickupDate: '',
    pickupTime: '',
    isRecurring: false,
    recurringFrequency: 'weekly',
    recurringDaysOfWeek: [],
    recurringStartDate: '',
    recurringEnds: 'by_date',
    recurringEndDate: '',
    recurringRideCount: null,
    notes: '',
  },
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(DEFAULT_BOOKING);

  const setAddress = useCallback((next: Partial<BookingAddressState>) => {
    setBooking((prev) => ({
      ...prev,
      address: { ...prev.address, ...next },
    }));
  }, []);

  const setPatient = useCallback((next: Partial<BookingPatientState>) => {
    setBooking((prev) => ({
      ...prev,
      patient: { ...prev.patient, ...next },
    }));
  }, []);

  const setService = useCallback((next: Partial<BookingState['service']>) => {
    setBooking((prev) => ({
      ...prev,
      service: { ...prev.service, ...next },
    }));
  }, []);

  const setAppointment = useCallback(
    (next: Partial<BookingState['appointment']>) => {
      setBooking((prev) => ({
        ...prev,
        appointment: { ...prev.appointment, ...next },
      }));
    },
    []
  );

  const setVehicle = useCallback((next: Partial<BookingState['vehicle']>) => {
    setBooking((prev) => ({
      ...prev,
      vehicle: { ...prev.vehicle, ...next },
    }));
  }, []);

  const setTrip = useCallback((next: Partial<BookingState['trip']>) => {
    setBooking((prev) => ({
      ...prev,
      trip: { ...prev.trip, ...next },
    }));
  }, []);

  const reset = useCallback(() => setBooking(DEFAULT_BOOKING), []);

  const value = useMemo<BookingContextValue>(
    () => ({
      booking,
      setAddress,
      setPatient,
      setService,
      setAppointment,
      setVehicle,
      setTrip,
      reset,
    }),
    [
      booking,
      reset,
      setAddress,
      setAppointment,
      setPatient,
      setService,
      setTrip,
      setVehicle,
    ]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return ctx;
}
