import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type LiveTrackContext = {
  rideId: string | null;
  driverId: string | null;
};

type LiveTrackStore = LiveTrackContext & {
  setLiveTrackContext: (context: LiveTrackContext) => void;
  clearLiveTrackContext: () => void;
};

export const useLiveTrackStore = create<LiveTrackStore>()(
  persist(
    (set) => ({
      rideId: null,
      driverId: null,
      setLiveTrackContext: (context) => set(context),
      clearLiveTrackContext: () => set({ rideId: null, driverId: null }),
    }),
    {
      name: 'medigo-live-track',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

