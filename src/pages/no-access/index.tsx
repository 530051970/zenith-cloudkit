import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import './style.scss';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NoAccess = () => {
  const jumpToIndex = () => {
    localStorage.clear();
    window.location.replace(window.location.origin);
    return;
  };
  const { t } = useTranslation();
  useEffect(() => {
    waitJumpToIndex();
  }, []);

  const waitJumpToIndex = () => {
    setTimeout(() => {
      jumpToIndex();
    }, 5000);
  };
  return (
    <div className="no-access">
      <Container header={<Header variant="h2">{t('loginExpired')}</Header>}>
        {t('loginExpiredDesc')}
        <span onClick={jumpToIndex} className="no-access-link">
          {t('here')}
        </span>{' '}
        {t('toJump')}
      </Container>
    </div>
  );
};

export default NoAccess;
