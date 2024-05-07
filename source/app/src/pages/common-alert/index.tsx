import { Alert } from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';
import { CommonAlertProps } from 'ts/common-alert/types';
import { COMMON_ALERT_TYPE } from './types/data_config';
import classnames from 'classnames';
import './style.scss';

const CommonAlert: React.FC = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertHideCls, setAlertHideCls] = useState(false);
  const [alertProps, setAlertProps] = useState({
    alertTxt: '',
    alertType: 'info',
  } as CommonAlertProps);
  useEffect(() => {
    window.addEventListener('showAlertMsg', showAlertMsg);
    return () => {
      window.removeEventListener('showAlertMsg', showAlertMsg);
    };
  }, []);

  const alertCls = classnames({
    'common-alert': true,
    'common-alert-hide': alertHideCls,
  });

  const showAlertMsg = (event: any) => {
    setAlertProps({
      alertTxt: event.detail.alertTxt,
      alertType: event.detail.alertType,
    });
    setAlertVisible(true);
    const hideTime =
      event.detail.alertType === COMMON_ALERT_TYPE.Success ? 2000 : 30000;
    setTimeout(() => {
      setAlertHideCls(true);
      setTimeout(() => {
        setAlertVisible(false);
        setAlertHideCls(false);
      }, 900);
    }, hideTime);
  };

  return (
    <div className={alertCls}>
      <Alert
        onDismiss={() => setAlertVisible(false)}
        visible={alertVisible}
        dismissAriaLabel="Close"
        type={alertProps.alertType}
        dismissible={alertProps.alertType !== COMMON_ALERT_TYPE.Success}
      >
        {alertProps.alertTxt}
      </Alert>
    </div>
  );
};

export default CommonAlert;
