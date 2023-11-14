import { Container, Header, Tabs } from '@cloudscape-design/components';
import AmazonS3 from './charts/Links';
import { Tools } from './charts/Tools';
import { RouterEnum } from 'routers/routerEnum';
import { useTranslation } from 'react-i18next';
import Links from './charts/Links';

const Charts = () => {
  const { t } = useTranslation();
  return (
    <Container
      header={
      <Header variant="h2" description={t('summary:dashboardDesc')}>
        {t('summary:dashboard')}
      </Header>
    }
    >
      <div>
        <Tabs
          tabs={[
            {
              label: t('summary:links'),
              id: 'link',
              content: <Links />,
            },
            {
              label: t('summary:tools'),
              id: 'tool',
              content: <Tools />,
            },
          ]}
        />
      </div>
    </Container>
  );
};

export default Charts;
