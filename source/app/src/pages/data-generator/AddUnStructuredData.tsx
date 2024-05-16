import React, { useState } from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import Tabs from '@cloudscape-design/components/tabs';
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { TAB_LIST } from 'enum/common_types';
import { useSearchParams } from 'react-router-dom';
import format from 'date-fns/format';
import { getExportS3Url, clearS3Object } from 'apis/data-catalog/api';
import './style.scss';
import {
  AppLayout,
  Box,
  Button,
  CollectionPreferences,
  ColumnLayout,
  Container,
  ContentLayout,
  FormField,
  Header,
  Input,
  Pagination,
  Table,
  TextFilter,
} from '@cloudscape-design/components';
import CustomBreadCrumb from 'pages/left-menu/CustomBreadCrumb';
import Navigation from 'pages/left-menu/Navigation';
import { RouterEnum } from 'routers/routerEnum';
import { useTranslation } from 'react-i18next';
import HelpInfo from 'common/HelpInfo';
import { buildDocLink } from 'ts/common';
import { alertMsg } from 'tools/tools';
import CustomizeFieldModal from './componments/CustomizeFieldModal';

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
