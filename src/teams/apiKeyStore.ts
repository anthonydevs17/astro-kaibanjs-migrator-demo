import { create } from 'zustand';

interface ApiKeyState {
  apiKeys: Record<string, string>;
  setApiKey: (name: string, key: string) => void;
  getApiKey: (name: string) => string | undefined;
}

export const useApiKeyStore = create<ApiKeyState>((set, get) => ({
  apiKeys: {},
  setApiKey: (name: string, key: string) =>
    set(state => ({
      apiKeys: { ...state.apiKeys, [name]: key }
    })),
  getApiKey: (name: string): string | undefined => {
    return get().apiKeys[name];
  }
}));
