'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

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
  };
  appointment: {
    type: string | null;
  };
  vehicle: {
    type: 'standard' | 'wheelchair' | 'stretcher' | null;
    passengers: number;
    promoCode: string;
  };
  trip: {
    type: 'one_way' | 'round_trip' | null;
    pickupDate: string;
    pickupTime: string;
    isRecurring: boolean;
    recurringFrequency: 'daily' | 'weekly' | 'bi_weekly' | 'monthly' | null;
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
  },
  appointment: {
    type: null,
  },
  vehicle: {
    type: null,
    passengers: 1,
    promoCode: '',
  },
  trip: {
    type: null,
    pickupDate: '',
    pickupTime: '',
    isRecurring: false,
    recurringFrequency: 'weekly',
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

  const value = useMemo<BookingContextValue>(
    () => ({
      booking,
      setAddress: (next) =>
        setBooking((prev) => ({
          ...prev,
          address: { ...prev.address, ...next },
        })),
      setPatient: (next) =>
        setBooking((prev) => ({
          ...prev,
          patient: { ...prev.patient, ...next },
        })),
      setService: (next) =>
        setBooking((prev) => ({
          ...prev,
          service: { ...prev.service, ...next },
        })),
      setAppointment: (next) =>
        setBooking((prev) => ({
          ...prev,
          appointment: { ...prev.appointment, ...next },
        })),
      setVehicle: (next) =>
        setBooking((prev) => ({
          ...prev,
          vehicle: { ...prev.vehicle, ...next },
        })),
      setTrip: (next) =>
        setBooking((prev) => ({
          ...prev,
          trip: { ...prev.trip, ...next },
        })),
      reset: () => setBooking(DEFAULT_BOOKING),
    }),
    [booking]
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
