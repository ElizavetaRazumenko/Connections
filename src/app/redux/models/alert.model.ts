export interface AlertNotify {
  message: string;
  isSuccess: boolean;
  id: string;
}

export interface AlertState {
  alert: AlertNotify[];
}
