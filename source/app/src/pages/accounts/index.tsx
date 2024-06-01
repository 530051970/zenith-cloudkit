import React, { useEffect, useState } from 'react';
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useSearchParams } from 'react-router-dom';
import './style.scss';
import {
  AppLayout,
  Box,
  Button,
  CollectionPreferences,
  ContentLayout,
  Header,
  Pagination,
  Table,
  TextFilter,
} from '@cloudscape-design/components';
import CustomBreadCrumb from 'pages/left-menu/CustomBreadCrumb';
import Navigation from 'pages/left-menu/Navigation';
import { RouterEnum } from 'routers/routerEnum';
import { useTranslation } from 'react-i18next';
import ConfigModal from './componments/ConfigModal';

// interface AccountProps{
//   account: string
//   ak: string
//   sk: string
//   status: number
//   description: string

// }
const DataGenerateHeader: React.FC = () => {
  const { t } = useTranslation();

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
  const [removeDisabled, setRemoveDisabled] = useState(false)
  const [editDisabled, setEditDisabled] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageItems, setCurrentPageItems] = useState([] as any[]);
  const [pageSize, setPageSize] = useState(10) 

  const accountData = [
    {
      id: 1,
      account: "23434324441",
      ak: "AKIASALSKK66ZTCRQRVZ",
      sk: "ySEQ****Ceh6",
      status: 1,
      description: ""
    },
    {
      id: 2,
      account: "53242443442",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 1,
      description: "This is for SDPS Developers!"
    },
    {
      id: 3,
      account: "434242344344",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 1,
      description: null
    },
    {
      id: 4,
      account: "434455454564",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    },
    {
      id: 5,
      account: "664353453545",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 1,
      description: "This is for SDPS Developers!"
    },
    {
      id: 6,
      account: "65656531445",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    },
    {
      id: 7,
      account: "434455454564",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    },
    {
      id: 8,
      account: "664353453545",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 1,
      description: "This is for SDPS Developers!"
    },
    {
      id: 9,
      account: "65656531445",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    },
    {
      id: 10,
      account: "434455454564",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    },
    {
      id: 11,
      account: "664353453545",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 1,
      description: "This is for SDPS Developers!"
    },
    {
      id: 12,
      account: "65656531445",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    },
    {
      id: 13,
      account: "434455454564",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    },
    {
      id: 14,
      account: "664353453545",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 1,
      description: "This is for SDPS Developers!"
    },
    {
      id: 15,
      account: "65656531445",
      ak: "AKIASALSKK66YMATV6FL",
      sk: "ySEs****Cek8",
      status: 0,
      description: "This is for SDPS Developers!"
    }
  ]

  const addAccount=()=>{
    setShowConfigModal(true)
  }

  const editAccount=()=>{
    setShowConfigModal(true)
  }

  const changePage = (currentPage:any)=>{
    setCurrentPageItems([])
    console.log("======= pageSize is:"+pageSize)
    setCurrentPage(currentPage)
    const startIndex = (currentPage-1)*pageSize
    const endIndex = currentPage*pageSize
    // console.log(customizeFields.slice(startIndex, endIndex))
    setCurrentPageItems(accountData.slice(startIndex, endIndex))
  }

  useEffect(()=>{
    if(selectedItems.length===0){
      setRemoveDisabled(true)
      setEditDisabled(true)
    } else if(selectedItems.length >1){
      setEditDisabled(true)
      setRemoveDisabled(false)
    } else {
      setRemoveDisabled(false)
      setEditDisabled(false)
    }

  },[selectedItems])

  useEffect(()=>{
    changePage(1)
  },[accountData, pageSize])

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
        }
      ]}
      columnDisplay={[
        { id: "account", visible: true },
        { id: "ak", visible: true },
        { id: "sk", visible: true },
        { id: "status", visible: true },
        { id: "description", visible: true }
      ]}
      items={currentPageItems}
      loadingText="Loading resources"
      selectionType="multi"
      stickyColumns={{ first: 0, last: 1 }}
      trackBy="id"
      empty={
        <Box
          margin={{ vertical: "xs" }}
          textAlign="center"
          color="inherit"
        >
          <SpaceBetween size="m">
            <b>没有配置账号</b>
            <Button>配置账号</Button>
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
              <Button  disabled={removeDisabled}>删除配置</Button>
              <Button onClick={editAccount} disabled={editDisabled}>
                修改配置
              </Button>
              <Button variant="primary" onClick={addAccount}>
                新增配置
              </Button>
            </SpaceBetween>
          }
        >
          配置列表
        </Header>
      }
      pagination={
        <Pagination currentPageIndex={currentPage}
        onChange={({ detail }) =>
          changePage(detail.currentPageIndex)
          // setCurrentPage()
        }
        pagesCount={Math.ceil(accountData.length/pageSize)} />
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
    {showConfigModal && <ConfigModal 
      showModal={showConfigModal}
      setShowModal={setShowConfigModal}
      />
    }
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
