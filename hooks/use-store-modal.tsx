import { create } from 'zustand';

interface useStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

// import {create} from "zustand"


// interface useStoreModalInterface {
//     isOpen: boolean,
//     onOpen: () => void,
//     onClose: () => void,
// };


// export const useStoreModal = create<useStoreModalInterface>((set) => ({
//     isOpen: false,
//     onOpen: () => set({isOpen: true}),
//     onClose: () => set({isOpen: false}),
// }))