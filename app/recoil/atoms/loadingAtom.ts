import { atom } from 'recoil';

export interface LoadingState {
  isLoading: boolean;
  loadingText: string;
}

export const loadingState = atom<LoadingState>({
  key: 'loadingState',
  default: {
    isLoading: false,
    loadingText: 'Loading...',
  },
});