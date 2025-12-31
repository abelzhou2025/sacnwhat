
export enum AppStatus {
  INITIAL,
  PREVIEW,
  LOADING,
  SUCCESS,
  ERROR,
}

export type Scan = {
  id: string;
  text: string;
  imageUrl: string;
  timestamp: number;
};
