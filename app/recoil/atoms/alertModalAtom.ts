import { atom } from 'recoil';

export interface AlertModalState {
    isOpen: boolean;
    title: string | null;
    message: string;
    type: 'error' | 'info' | 'warning';
}

export const alertModalState = atom<AlertModalState>({
    key: 'alertModalState', // 고유 key (필수)
    default: {
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
    },
});
