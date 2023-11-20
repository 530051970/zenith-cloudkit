import React, { useState } from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import Tabs from '@cloudscape-design/components/tabs';
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import SpaceBetween from "@cloudscape-design/components/space-between";
import CatalogList from './componments/CatalogList';
import { TAB_LIST } from 'enum/common_types';
import { useSearchParams } from 'react-router-dom';
import format from 'date-fns/format';
import { getExportS3Url, clearS3Object } from 'apis/data-catalog/api';
import './style.scss';
import {
  AppLayout,
  Box,
  Button,
  ColumnLayout,
  Container,
  ContentLayout,
  FormField,
  Header,
  Input,
} from '@cloudscape-design/components';
import CustomBreadCrumb from 'pages/left-menu/CustomBreadCrumb';
import Navigation from 'pages/left-menu/Navigation';
import { RouterEnum } from 'routers/routerEnum';
import { useTranslation } from 'react-i18next';
import HelpInfo from 'common/HelpInfo';
import { buildDocLink } from 'ts/common';
import { alertMsg } from 'tools/tools';

const DataGenerateHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Header variant="h2" 
      actions={<Button>Button</Button>}
      description={t('datagenerate:dataGenerateDesc')}
      >
      {t('datagenerate:dataGenerate')}
    </Header>
  );
};

const DataGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [
    activeStepIndex,
    setActiveStepIndex
  ] = React.useState(0);


  const breadcrumbItems = [
    { text: t('breadcrumb.home'), href: RouterEnum.Home.path },
    { text: t('breadcrumb.browserCatalog'), href: RouterEnum.DataGenerate.path },
  ];

  return (
    <AppLayout
      contentHeader={<DataGenerateHeader />}
      
      content={
        <ContentLayout className="catalog-layout">
  return (
    <Wizard
      i18nStrings={{
        stepNumberLabel: stepNumber =>
          `Step ${stepNumber}`,
        collapsedStepsLabel: (stepNumber, stepsCount) =>
          `Step ${stepNumber} of ${stepsCount}`,
        skipToButtonLabel: (step, stepNumber) =>
          `Skip to ${step.title}`,
        navigationAriaLabel: "Steps",
        cancelButton: "Cancel",
        previousButton: "Previous",
        nextButton: "Next",
        submitButton: "Launch instance",
        optional: "optional"
      }}
      onNavigate={({ detail }) =>
        setActiveStepIndex(detail.requestedStepIndex)
      }
      activeStepIndex={activeStepIndex}
      allowSkipTo
      steps={[
        {
          title: "Choose instance type",
          content: (
            <Container
              header={
                <Header variant="h2">
                  Form container header
                </Header>
              }
            >
              <SpaceBetween direction="vertical" size="l">
                <FormField label="First field">
                  <Input value=''/>
                </FormField>
                <FormField label="Second field">
                  <Input value=''/>
                </FormField>
              </SpaceBetween>
            </Container>
          )
        },
        {
          title: "Add storage",
          content: (
            <Container
              header={
                <Header variant="h2">
                  Form container header
                </Header>
              }
            >
              <SpaceBetween direction="vertical" size="l">
                <FormField label="First field">
                  <Input value=''/>
                </FormField>
                <FormField label="Second field">
                  <Input value=''/>
                </FormField>
              </SpaceBetween>
            </Container>
          ),
          isOptional: true
        },
        {
          title: "Configure security group",
          content: (
            <Container
              header={
                <Header variant="h2">
                  Form container header
                </Header>
              }
            >
              <SpaceBetween direction="vertical" size="l">
                <FormField label="First field">
                  <Input value=''/>
                </FormField>
                <FormField label="Second field">
                  <Input value=''/>
                </FormField>
              </SpaceBetween>
            </Container>
          ),
          isOptional: true
        },
        {
          title: "Review and launch",
          content: (
            <SpaceBetween size="xs">
              <Header
                variant="h3"
                actions={
                  <Button
                    onClick={() => setActiveStepIndex(0)}
                  >
                    Edit
                  </Button>
                }
              >
                Step 1: Instance type
              </Header>
              <Container
                header={
                  <Header variant="h2">
                    Container title
                  </Header>
                }
              >
                <ColumnLayout
                  columns={2}
                  variant="text-grid"
                >
                  <div>
                    <Box variant="awsui-key-label">
                      First field
                    </Box>
                    <div>Value</div>
                  </div>
                  <div>
                    <Box variant="awsui-key-label">
                      Second Field
                    </Box>
                    <div>Value</div>
                  </div>
                </ColumnLayout>
              </Container>
            </SpaceBetween>
          )
        }
      ]}
    />
  );
        </ContentLayout>
      }
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigation={<Navigation activeHref={RouterEnum.DataGenerate.path} />}
      navigationWidth={290}
    />
  );
};

export default DataGenerator;
