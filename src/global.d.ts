declare global {
  interface Window {
    launcher?: {
      play: () => Promise<{ ok: boolean; message: string }>;
      openFolder: () => Promise<{ ok: boolean; message: string }>;
    };
  }
}

export {};
