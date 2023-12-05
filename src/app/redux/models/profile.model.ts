export interface ProfileData {
  email: string;
  name: string;
  uid: string;
  createdAt: string;
}

export interface ProfileState {
  profile: ProfileData;
}
