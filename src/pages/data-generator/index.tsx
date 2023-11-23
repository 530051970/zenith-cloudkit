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

const DataGenerateHeader: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Header variant="h2" 
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
    { text: t('breadcrumb.browserCatalog'), href: RouterEnum.DataGenerate.path },
  ];

  const modalProps = {
    showModal,
    setShowModal
  };

  return (
    
    <AppLayout
      contentHeader={<DataGenerateHeader />}
      
      content={
        
        <ContentLayout className="generator-layout">
          
    <Wizard
      i18nStrings={{
        stepNumberLabel: stepNumber =>
          `步骤 ${stepNumber}`,
        collapsedStepsLabel: (stepNumber, stepsCount) =>
          `步骤 ${stepNumber} of ${stepsCount}`,
        // skipToButtonLabel: (step, stepNumber) =>
        //   `跳转到 ${step.title}`,
        navigationAriaLabel: "Steps",
        cancelButton: "取消",
        previousButton: "上一步",
        nextButton: "下一步",
        submitButton: "启动任务",
        optional: "可选"
      }}
      onNavigate={({ detail }) =>
        setActiveStepIndex(detail.requestedStepIndex)
      }
      activeStepIndex={activeStepIndex}
      allowSkipTo
      steps={[
        {
          title: "自定义字段",
          isOptional: true,
          description:
            "请指定最后的数据中必须包含的字段以及类型，如果没有特意指定的请点击下一步跳过...",
          content: (
            // <Container
            //   header={
            //     <Header variant="h3">
            //       当前指定字段
            //     </Header>
            //   }
            // >
              <Table
      onSelectionChange={({ detail }:{detail:any}) =>
        setSelectedItems(detail.selectedItems)
      }
      selectedItems={selectedItems}
      ariaLabels={{
        selectionGroupLabel: "Items selection",
        allItemsSelectionLabel: ({ selectedItems }) =>
          `${selectedItems.length} ${
            selectedItems.length === 1 ? "item" : "items"
          } selected`,
        itemSelectionLabel: ({ selectedItems }, item) =>
          item.name
      }}
      columnDefinitions={[
        {
          id: "name",
          header: "字段名称",
          cell: (e:any) => e.name,
          sortingField: "name",
          isRowHeader: true
        },
        { id: "type", header: "字段类型", cell: e => e.type },
        { id: "comment", header: "说明", cell: e => e.comment }
      ]}
      columnDisplay={[
        { id: "name", visible: true },
        { id: "type", visible: true },
        { id: "comment", visible: true }
      ]}
      items={[
        
      ]}
      loadingText="Loading resources"
      selectionType="multi"
      trackBy="name"
      empty={
        <Box
          margin={{ vertical: "xs" }}
          textAlign="center"
          color="inherit"
        >
          <SpaceBetween size="m">
            <b>没有自定义字段</b>
            <Button onClick={()=>setShowModal(true)}>添加自定义字段</Button>
          </SpaceBetween>
        </Box>
      }
      filter={
        <TextFilter
          filteringPlaceholder="Find resources"
          filteringText=""
        />
      }
      header={
        <Header
          counter={
            selectedItems.length
              ? "(" + selectedItems.length + "/10)"
              : "(10)"
          }
          actions={
            <SpaceBetween
              direction="horizontal"
              size="xs"
            >
              <Button>移除自定义字段</Button>
              <Button variant="primary" onClick={showCustomizeModal}>
                新增自定义字段
              </Button>
            </SpaceBetween>
          }
        >
          自定义字段
        </Header>
      }
      pagination={
        <Pagination currentPageIndex={1} pagesCount={2} />
      }
      preferences={
        <CollectionPreferences
          title="Preferences"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          preferences={{
            pageSize: 10,
            contentDisplay: [
              { id: "variable", visible: true },
              { id: "value", visible: true },
              { id: "type", visible: true },
              { id: "description", visible: true }
            ]
          }}
          pageSizePreference={{
            title: "Page size",
            options: [
              { value: 10, label: "10 resources" },
              { value: 20, label: "20 resources" }
            ]
          }}
          // wrapLinesPreference={{}}
          // stripedRowsPreference={{}}
          // contentDensityPreference={{}}
          // contentDisplayPreference={{
          //   options: [
          //     { id: "name", label: "Field name" },
          //     { id: "type", label: "Field type" }
          //   ]
          // }}
          stickyColumnsPreference={{
            firstColumns: {
              title: "Stick first column(s)",
              description:
                "Keep the first column(s) visible while horizontally scrolling the table content.",
              options: [
                { label: "None", value: 0 },
                { label: "First column", value: 1 },
                { label: "First two columns", value: 2 }
              ]
            },
            lastColumns: {
              title: "Stick last column",
              description:
                "Keep the last column visible while horizontally scrolling the table content.",
              options: [
                { label: "None", value: 0 },
                { label: "Last column", value: 1 }
              ]
            }
          }}
        />
      }
    />
    
            // </Container>
          )
        },
        {
          title: "设置其他参数",
          description:
            "请指定最后的数据中必须包含的字段以及类型，如果没有特意指定的请点击下一步跳过...",
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
          title: "选择导出方式",
          description:
            "请指定最后的数据中必须包含的字段以及类型，如果没有特意指定的请点击下一步跳过...",
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
          title: "预览并启动任务",
          description:
            "请指定最后的数据中必须包含的字段以及类型，如果没有特意指定的请点击下一步跳过...",
          content: (
            <SpaceBetween size="xs">
              {/* <Header
                variant="h3"
                
              >
                Step 1: Instance type
              </Header> */}
              <Container
                header={
                  <Header variant="h2"
                  actions={
                    <Button
                      onClick={() => setActiveStepIndex(0)}
                    >
                      重新编辑
                    </Button>
                  }
                  >
                    任务详情
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
      {showModal && <CustomizeFieldModal {...modalProps}/>}
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
