declare namespace Studio {
  export type SettingProp = 'description' | 'locked';

  export type InitSetting = {
    name: string;
    location: string;
    description: string;
    locked: boolean;
  };
}
