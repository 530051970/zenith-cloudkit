import React, { useEffect, useState } from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import Tabs from '@cloudscape-design/components/tabs';
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { TAB_LIST } from 'enum/common_types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import format from 'date-fns/format';
import { getExportS3Url, clearS3Object } from 'apis/data-catalog/api';
import './style.scss';
import {
  AppLayout,
  Box,
  Button,
  Cards,
  CollectionPreferences,
  ColumnLayout,
  Container,
  ContentLayout,
  FormField,
  Header,
  Input,
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
import CustomizeFieldModal from './componments/CustomizeFieldModal';
import { useLocalStorage } from 'common/useLocalStorage';
import { DEFAULT_PREFERENCES } from './generator-config';

const DataGenerateHeader: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  
  const genData = (type: string) => {
    if(type==="1"){
      navigate(RouterEnum.DataGenerateUnStructured.path);
    } else {
      navigate(RouterEnum.DataGenerateStructured.path);
    }
    return;
  };

  return (
    <Header variant="h2" 
    actions={
      <SpaceBetween size="xs" direction="horizontal">
        <ButtonDropdown
      items={[
        { text: "删除", id: "rm", disabled: false },
        { text: "编辑", id: "mv", disabled: false },
        { text: "复制并生成", id: "rn", disabled: true }
      ]}
    >
      更多操作
    </ButtonDropdown>
        <Button data-testid="header-btn-edit" onClick={()=>genData("1")}>
          生成非结构化数据
        </Button>
        <Button data-testid="header-btn-delete" variant="primary" onClick={()=>genData("2")}>
          生成结构化数据
        </Button>
      </SpaceBetween>
    }
      description={t('datagenerate:dataGenerateDesc')}
      >
      {t('datagenerate:dataGenerate')}
    </Header>
  );
};


const DataGenerateContent: React.FC<any> = (props:any) => {
  const {selectedItems, onchangeSelected} = props;
  const [loading, setLoading] = useState(true);
  const [distributions, setDistributions] = useState([]);
  const [preferences, setPreferences] = useLocalStorage('React-Cards-Preferences', DEFAULT_PREFERENCES);
  // const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
  //   distributions,
  //   {
  //     filtering: {
  //       empty: <TableEmptyState resourceName="Distribution" />,
  //       noMatch: <TableNoMatchState onClearFilter={() => actions.setFiltering('')} />,
  //     },
  //     pagination: { pageSize: preferences.pageSize },
  //     selection: {},
  //   }
  // );

  useEffect(() => {
    // new DataProvider().getData('distributions').then(distributions => {
    //   setDistributions(distributions);
    //   setLoading(false);
    // });
  }, []);

  return (
    <div style={{marginTop:10}}>
    <Cards
      onSelectionChange={({ detail }) =>
        
        props.onchangeSelected(detail.selectedItems)
      }
      selectedItems={props.selectedItems}
      ariaLabels={{
        itemSelectionLabel: (e, n) => `select ${n.name}`,
        selectionGroupLabel: "Item selection"
      }}
      cardDefinition={{
        header: (item: any) => (
          <Link href="#" fontSize="heading-m">
            {item.name}
          </Link>
        ),
        sections: [
          {
            id: "description",
            header: "描述",
            content: (item: any) => <div style={{textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "90%"}}>{item.description}</div>
          },
          {
            id: "output",
            header: "最终形态",
            content: (item: any) => <>({item.type}){item.output}</>
          },
          {
            id: "status",
            header: "状态",
            content: (item: any) => item.status
          }
        ]
      }}
      cardsPerRow={[
        { cards: 1 },
        { minWidth: 400, cards: 4 }
      ]}
      items={[
        {
          name: "任务 1",
          alt: "First",
          description: "往78893232账号的beijing区域的S3导入测试数据",
          output: "S3",
          type:"结构化任务",
          status: "已完成"
        },
        {
          name: "任务 2",
          alt: "Second",
          description: "敏感数据压测环境结构化数据生成",
          output: "RDS",
          type:"结构化任务",
          status: "已完成"
        },
        {
          name: "任务 3",
          alt: "Third",
          description: "-",
          output: "SQL文件",
          type:"结构化任务",
          status: "进行中"
        },
        {
          name: "任务 4",
          alt: "Fourth",
          description: "哈色哈手机客户端",
          type:"结构化任务",
          output: "CSV文件",
          status: "进行中"
        },
        {
          name: "任务 5",
          alt: "Fifth",
          description: "将卡洛斯到风口浪尖开了房间",
          type:"非结构化任务",
          output: "OpenSearch",
          size: "Large"
        },
        {
          name: "任务 6",
          alt: "Sixth",
          description: "也请万语千言为礼哦UI哦",
          type:"非结构化任务",
          output: "S3",
          status: "已中止"
        }
      ]}
      loadingText="Loading resources"
      selectionType="multi"
      trackBy="name"
      visibleSections={["description", "output", "status"]}
      empty={
        <Box
          margin={{ vertical: "xs" }}
          textAlign="center"
          color="inherit"
        >
          <SpaceBetween size="m">
            <b>暂时没有任务</b>
            <Button>创建任务</Button>
          </SpaceBetween>
        </Box>
      }
      filter={
        <TextFilter filteringPlaceholder="查找任务" filteringText={''} />
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
            pageSize: 6,
            visibleContent: [
              "description",
              "output",
              "status"
            ]
          }}
          pageSizePreference={{
            title: "Page size",
            options: [
              { value: 6, label: "6 resources" },
              { value: 12, label: "12 resources" }
            ]
          }}
          visibleContentPreference={{
            title: "Select visible content",
            options: [
              {
                label: "Main distribution properties",
                options: [
                  {
                    id: "description",
                    label: "描述"
                  },
                  { id: "output", label: "最终形态" },
                  { id: "status", label: "状态" }
                ]
              }
            ]
          }}
        />
      }
    />
    </div>
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
    { text: t('breadcrumb.dataGenerator'), href: RouterEnum.DataGenerate.path },
  ];

  const modalProps = {
    showModal,
    setShowModal
  };

  return (
    
    <AppLayout
      contentHeader={<DataGenerateHeader />}
      
      content={
        <DataGenerateContent />
      }
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigationHide={true}
    />
    
  );
};

export default DataGenerator;
