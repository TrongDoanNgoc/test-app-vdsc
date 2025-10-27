import {create} from 'zustand';

interface DemoStore {
  demo: string;
  setDemo: (demo: string) => void;
}
export const useDemoStore = create<DemoStore>(set => ({
  demo: '',
  setDemo: demo => set({demo}),
}));
