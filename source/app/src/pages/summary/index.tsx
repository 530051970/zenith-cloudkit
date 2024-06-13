import {
  AppLayout,
  ContentLayout,
  Header
} from '@cloudscape-design/components';
import CustomBreadCrumb from 'pages/left-menu/CustomBreadCrumb';
import Navigation from 'pages/left-menu/Navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
import Charts from './comps/Charts';

const HomeHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Header variant="h2" description={t('summary:desc')}>
      {t('summary:summary')}
    </Header>
  );
};

const HomeContent: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <ContentLayout>
      <div className="mt-10">
        <Charts />
      </div>
    </ContentLayout>
  );
};

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const breadcrumbItems = [
    {
      text: t('breadcrumb.home'),
      href: RouterEnum.Home.path,
    },
    {
      text: t('breadcrumb.summary'),
      href: RouterEnum.Home.path,
    },
  ];
  return (
    <>
    {/* <LayoutHeader signOut={()=>{}} user={""} /> */}
    <AppLayout
      contentHeader={<HomeHeader />}
      content={<HomeContent />}
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigation={<Navigation activeHref={RouterEnum.Home.path} />}
      navigationWidth={290}
      toolsHide={true}
    />
    </>
  );
};

export default Home;
