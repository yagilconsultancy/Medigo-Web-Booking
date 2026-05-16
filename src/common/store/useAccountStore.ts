import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccountType = 'individual' | 'facility';

type AccountStore = {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
};

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      accountType: 'individual',
      setAccountType: (type) => set({ accountType: type }),
    }),
    {
      name: 'medigo-account-type',
    }
  )
);
