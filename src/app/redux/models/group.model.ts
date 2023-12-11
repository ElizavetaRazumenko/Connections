export interface GroupData {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

export interface GroupState {
  group: {
    Count: number;
    data: GroupData[];
    errorMessage: string;
  };
}
