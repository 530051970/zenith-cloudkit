import {
    AppLayout,
    ContentLayout,
    Header
} from '@cloudscape-design/components';
import CustomBreadCrumb from 'pages/left-menu/CustomBreadCrumb';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
import './style.scss';

const AddUnStructuredDataHeader: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Header variant="h2" 
      description={t('datagenerate:dataGenerateUnStructuredDesc')}
      >
      {t('datagenerate:dataGenerateUnStructured')}
    </Header>
  );
};

const AddUnStructuredData: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [
    activeStepIndex,
    setActiveStepIndex
  ] = React.useState(0);
  const [showModal, setShowModal] = useState(false);

  const [
    selectedItems,
    setSelectedItems
  ] = React.useState([]);


  const showCustomizeModal = () => {
    console.log("show!!!");
    setShowModal(true);
    return;
  };

  const breadcrumbItems = [
    { text: t('breadcrumb.home'), href: RouterEnum.Home.path },
    { text: t('breadcrumb.dataGenerator'), href: RouterEnum.DataGenerate.path },
    { text: t('breadcrumb.genUnStructuredData'), href: RouterEnum.DataGenerateStructured.path },
  ];

  const modalProps = {
    showModal,
    setShowModal
  };

  return (
    
    <AppLayout
      contentHeader={<AddUnStructuredDataHeader />}
      
      content={
        
        <ContentLayout className="generator-layout">
         


        </ContentLayout>
      }
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigationHide={true}
    
              
    />
    
  );
};

export default AddUnStructuredData;
