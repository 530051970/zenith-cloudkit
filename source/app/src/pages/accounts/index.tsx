import React, { useState } from 'react';
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
  CollectionPreferences,
  Container,
  ContentLayout,
  Header,
  Link,
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

const DataGenerateHeader: React.FC = () => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [fileType, setFileType] = React.useState("xlsx");



  return (
    <Header variant="h2" 
      description={t('account:accountCenterDesc')}
      >
      {t('account:accountCenter')}
    </Header>
  );
};

const Accounts: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [
    selectedItems,
    setSelectedItems
  ] = React.useState([] as any);
  const accountData = [
    {
      account: "23434324441",
      ak: "AKIASALSKK66ZTCRQRVZ",
      sk: "ySEQ****Ceh6",
      status: 1,
      description: ""
    },
    {
      account: "53242443442",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 1,
      description: "This is for SDPS Developers!"
    },
    {
      account: "434242344344",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 1,
      description: null
    },
    {
      account: "434455454564",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    },
    {
      account: "664353453545",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 1,
      description: "This is for SDPS Developers!"
    },
    {
      account: "65656531445",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    }
  ]

  const breadcrumbItems = [
    { text: t('breadcrumb.home'), href: RouterEnum.Home.path },
    { text: t('breadcrumb.accountManagement'), href: RouterEnum.DataGenerate.path },
  ];

  return (
    <AppLayout
      contentHeader={<DataGenerateHeader />}
      content={
        <ContentLayout className="catalog-layout">
           <Table
      onSelectionChange={({ detail }) =>
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
          item.account
      }}
      columnDefinitions={[
        {
          id: "account",
          header: "账号",
          cell: item => item.account,
          sortingField: "name",
          isRowHeader: true
        },
        {
          id: "ak",
          header: "访问令牌",
          cell: item => item.ak
        },
        {
          id: "sk",
          header: "密钥",
          cell: item => item.sk
        },
        {
          id: "status",
          header: "状态",
          cell: item => item.status===1?(<span style={{fontSize:12}}>有效</span>):(<span style={{fontSize:12,color:'red'}}>失效</span>)
        },
        {
          id: "description",
          header: "描述",
          cell: item => (item.description===""||item.description===null)?("-"):item.description
        },
        {
          id: "action",
          header: "操作",
          cell: item => <Link>权限策略</Link>
        }
      ]}
      columnDisplay={[
        { id: "account", visible: true },
        { id: "ak", visible: true },
        { id: "sk", visible: true },
        { id: "status", visible: true },
        { id: "description", visible: true },
        { id: "action", visible: true }
      ]}
      items={accountData}
      loadingText="Loading resources"
      selectionType="multi"
      stickyColumns={{ first: 0, last: 1 }}
      trackBy="name"
      empty={
        <Box
          margin={{ vertical: "xs" }}
          textAlign="center"
          color="inherit"
        >
          <SpaceBetween size="m">
            <b>No resources</b>
            <Button>Create resource</Button>
          </SpaceBetween>
        </Box>
      }
      filter={
        <TextFilter
          filteringPlaceholder="关键词查找..."
          filteringText=""
        />
      }
      header={
        <Header
          counter={
            selectedItems.length
              ? `(${selectedItems.length}/${accountData.length})`
              : `(${accountData.length})`
          }
          actions={
            <SpaceBetween
              direction="horizontal"
              size="xs"
            >
              <Button>删除配置</Button>
              <Button variant="primary">
                新增配置
              </Button>
            </SpaceBetween>
          }
        >
          配置列表
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
        </ContentLayout>
      }
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigation={<Navigation activeHref={RouterEnum.DataGenerate.path} />}
      navigationWidth={290}
    />
  );
};

export default Accounts;
