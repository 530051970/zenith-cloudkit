export type AlertType = 'error' | 'warning' | 'info' | 'success';

export interface CommonAlertProps {
  alertTxt: string;
  alertType: AlertType;
}
