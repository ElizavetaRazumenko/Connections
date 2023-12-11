export interface ProfileData {
  email: string;
  name: string;
  uid: string;
  createdAt: string;
  isDataBeenReceived: boolean;
}

export interface ProfileState {
  profile: {
    data: ProfileData;
    errorMessage: string;
  };
}
