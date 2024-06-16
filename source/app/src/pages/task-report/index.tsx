import {
  Alert,
  AppLayout,
  Box,
  Button,
  Cards,
  CollectionPreferences,
  Header,
  Link,
  Pagination,
  SpaceBetween,
  TextFilter
} from '@cloudscape-design/components';
import CustomBreadCrumb from 'pages/left-menu/CustomBreadCrumb';
import Navigation from 'pages/left-menu/Navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterEnum } from 'routers/routerEnum';
import { DEFAULT_PREFERENCES } from './report-config';
// import {
//   TableEmptyState,
//   TableNoMatchState,
// } from './common-components';
import { useLocalStorage } from '../../common/component/useLocalStorage';


const ReportHeader: React.FC<any> = (props:any) => {
  const { t } = useTranslation();
  const { selectedItems } = props;
  return (
    // <Header variant="h1" description="">
    //   {t('summary:summary')}
    // </Header>
    <SpaceBetween size="m">
              <Header variant="h2" description={t('taskreport:subtitle')} counter={
                 selectedItems.length
                 ? "(" + selectedItems.length + "/10)"
                 : "(10)"
              }>
                {t('taskreport:title')}
              </Header>
              <Alert statusIconAriaLabel="Info" header="自定义检测报告并下载">
                本页面默认以任务为单位展示检测报告。您也可以根据业务需要自定义检测报告并下载，目前支持自定义时间范围指定数据库或者指定数据表。
              点击<a href="#" style={{textDecoration:"None",color:"#0972d3"}}>这里</a>开始自定义导出。
              </Alert>
            </SpaceBetween>
  );
};



const ReportContent: React.FC<any> = (props:any) => {
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
            header: "Description",
            content: (item: any) => item.description
          },
          {
            id: "type",
            header: "Type",
            content: (item: any) => item.type
          },
          {
            id: "size",
            header: "Size",
            content: (item: any) => item.size
          }
        ]
      }}
      cardsPerRow={[
        { cards: 1 },
        { minWidth: 400, cards: 4 }
      ]}
      items={[
        {
          name: "Item 1",
          alt: "First",
          description: "This is the first item",
          type: "1A",
          size: "Small"
        },
        {
          name: "Item 2",
          alt: "Second",
          description: "This is the second item",
          type: "1B",
          size: "Large"
        },
        {
          name: "Item 3",
          alt: "Third",
          description: "This is the third item",
          type: "1A",
          size: "Large"
        },
        {
          name: "Item 4",
          alt: "Fourth",
          description: "This is the fourth item",
          type: "2A",
          size: "Small"
        },
        {
          name: "Item 5",
          alt: "Fifth",
          description: "This is the fifth item",
          type: "2A",
          size: "Large"
        },
        {
          name: "Item 6",
          alt: "Sixth",
          description: "This is the sixth item",
          type: "1A",
          size: "Small"
        }
      ]}
      loadingText="Loading resources"
      selectionType="multi"
      trackBy="name"
      visibleSections={["description", "type", "size"]}
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
        <TextFilter filteringPlaceholder="Find resources" filteringText={''} />
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
              "type",
              "size"
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
                    label: "Description"
                  },
                  { id: "type", label: "Type" },
                  { id: "size", label: "Size" }
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

const TaskReport: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [
    selectedItems,
    setSelectedItems
  ] = React.useState([]);
  const appLayout = useRef();
  const onchangeSelected =(items:any)=>{
    setSelectedItems(items)
  }
  const breadcrumbItems = [
    {
      text: t('breadcrumb.home'),
      href: RouterEnum.Home.path,
    },
    {
      text: t('breadcrumb.browserTaskReport'),
      href: RouterEnum.TaskReport.path,
    },
  ];
  return (
    <AppLayout
      contentHeader={<ReportHeader selectedItems={selectedItems}/>}
      content={<ReportContent selectedItems={selectedItems} onchangeSelected={onchangeSelected}/>}
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigation={<Navigation activeHref={RouterEnum.TaskReport.path} />}
      navigationWidth={290}
    />
  );
};

export default TaskReport;
