export {};

declare global {
  type NivaLoader = 'vanilla' | 'fabric' | 'forge' | 'neoforge' | 'quilt';
  type NivaTheme = 'dark' | 'light';

  interface NivaProfile {
    id: string;
    name: string;
    loader: NivaLoader;
    gameVersion: string;
    createdAt: string;
  }
  interface NivaSettings { theme: NivaTheme; reduceMotion: boolean; }
  interface NivaAppInfo { version: string; platform: string; userDataPath: string; packaged: boolean; }
  interface Window {
    niva: {
      getInfo(): Promise<NivaAppInfo>;
      listProfiles(): Promise<{ profiles: NivaProfile[]; activeProfileId: string | null }>;
      createProfile(input: { name: string; loader: NivaLoader; gameVersion: string }): Promise<NivaProfile>;
      activateProfile(id: string): Promise<{ activeProfileId: string }>;
      deleteProfile(id: string): Promise<{ deleted: true }>;
      getSettings(): Promise<NivaSettings>;
      updateSettings(patch: Partial<NivaSettings>): Promise<NivaSettings>;
      openDataFolder(): Promise<{ opened: true }>;
      openOfficialLauncher(): Promise<{ opened: true; destination: string; message?: string }>;
    };
  }
}
