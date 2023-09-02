import { create } from "zustand";
export type ModalStore = {
  modal: React.ReactNode | null;
  setModal: (modal: React.ReactNode) => void;
  clearModal: () => void;
};

export type LoadingStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  setModal: (modal) => set({ modal }),
  clearModal: () => set({ modal: null }),
}));

export const useLoadingStore = create<LoadingStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));
