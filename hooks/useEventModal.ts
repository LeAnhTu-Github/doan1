import { create } from "zustand";

interface EventModalStore {
  eventId: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useEventModal = create<EventModalStore>((set) => ({
  eventId: "",
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, eventId: id }),
  onClose: () => set({ isOpen: false, eventId: "" }),
}));

export default useEventModal;