import React, { useEffect, useState } from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useSearchParams } from 'react-router-dom';
import './style.scss';
import {
  AppLayout,
  Box,
  Button,
  CollectionPreferences,
  ColumnLayout,
  Container,
  ContentLayout,
  DatePicker,
  ExpandableSection,
  FormField,
  Grid,
  Header,
  Input,
  Pagination,
  RadioGroup,
  Select,
  Table,
  TextFilter,
  Tiles,
} from '@cloudscape-design/components';
import Navigation from 'pages/left-menu/Navigation';
import { RouterEnum } from 'routers/routerEnum';
import CustomBreadCrumb from 'pages/left-menu/CustomBreadCrumb';
import { useTranslation } from 'react-i18next';
import CustomizeFieldModal from './componments/CustomizeFieldModal';
import { InfoLink } from 'pages/task-report/info-link';
import HelpInfo from 'common/HelpInfo';
import { buildDocLink } from 'ts/common';
import { DEFAULT_CONFIG, RANDOM_TYPE } from './types/field_config';


interface Field {
  name: string;
  type: string;
  comment: string;
}

const AddStructuredDataHeader: React.FC = () => {
  const { t } = useTranslation();
  
  
  return (
    <Header variant="h2" 
      description={t('datagenerate:dataGenerateStructuredDesc')}
      >
      {t('datagenerate:dataGenerateStructured')}
    </Header>
  );
};

const AddStructuredData: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [removeDisabled, setRemoveDisabled] = useState(true)
  const [pageSize, setPageSize] =  useState(10)
  const [objectPrefix, setObjectPrefix] =  useState("demo")
  const [objectNum, setObjectNum] = useState(100)
  const [itemFieldNum, setItemFieldNum] = useState(50)
  const [startDate, setStartDate] = useState(DEFAULT_CONFIG.startDate)
  const [endDate, setEndDate] = useState(DEFAULT_CONFIG.endDate)
  const [outputType, setOutputType] = useState(DEFAULT_CONFIG.outputType)
  const [outputFormat, setOutputFormat] = useState(DEFAULT_CONFIG.outputFormat)
  const [targetAccount, setTargetAccount] = useState({} as any)
  const [targetService, setTargetService] = useState({} as any)
  const [targetEndpoint, setTargetEndpoint] = useState({} as any)
  const [targetRegion, setTargetRegion] = useState({} as any)


  // const [preferences, setPreferences] = useState({
  //   pageSize: 10,
  //   wrapLines: true,
  // } as any);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageItems, setCurrentPageItems] = useState([]);
  const [
    activeStepIndex,
    setActiveStepIndex
  ] = React.useState(0);
  const [showModal, setShowModal] = useState(false);
  const [
    customizeFields,
    setCustomizeFields
  ] = React.useState([] as any);

  const [
    selectedItems,
    setSelectedItems
  ] = React.useState([]);

  useEffect(()=>{
    changePage(1)
  },[pageSize, customizeFields])

  useEffect(()=>{
    if(selectedItems.length === 0){
      setRemoveDisabled(true)
    } else {
      setRemoveDisabled(false)
    }
  },[selectedItems])

  const showCustomizeModal = () => {
    setShowModal(true);
    return;
  };

  const changePage = (currentPage:any)=>{
    console.log("======= pageSize is:"+pageSize)
    setCurrentPage(currentPage)
    const startIndex = (currentPage-1)*pageSize
    const endIndex = currentPage*pageSize
    // console.log(customizeFields.slice(startIndex, endIndex))
    setCurrentPageItems(customizeFields.slice(startIndex, endIndex))
  }

  const removeFields = ()=>{
    console.log(selectedItems)
    let fields = customizeFields
    selectedItems.forEach((item:Field)=>{
      fields = fields.filter((i:Field)=>i.name !== item.name)
    })
    setCustomizeFields(fields)
    setSelectedItems([])
  }

  const changeCustomizeFields = (addCustomizeFields:[]) => {
    // console.log(addCustomizeFields);
    const fields:Field[] = customizeFields
    addCustomizeFields.forEach((item:any) => {
      let name
      const exsitedLength = fields.filter(i => i.name.startsWith("custom_"+item.prefix)).length
      for (let i = 0; i < item.cnt; i++) {
        if(exsitedLength === 0){
          if (i === 0){
            name = "custom_"+item.prefix
          } else {
            name = "custom_"+item.prefix+ "_"+i
          }
          fields.push({
           name: name,
           type: item.type,
           comment: item.tags[0]
          })
        } else {
         fields.push({
           name: "custom_"+item.prefix+"_"+(exsitedLength+i),
           type: item.type,
           comment: item.tags[0]
          })
        }
      }
    })
    setCustomizeFields(fields)
    changePage(1)
    // const startIndex = (currentPage-1)*preferences.pageSize
    // const endIndex = currentPage*preferences.pageSize
    // // console.log(customizeFields.slice(startIndex, endIndex))
    // setCurrentPageItems(customizeFields.slice(startIndex, endIndex))
  };

  const breadcrumbItems = [
    { text: t('breadcrumb.home'), href: RouterEnum.Home.path },
    { text: t('breadcrumb.dataGenerator'), href: RouterEnum.DataGenerate.path },
    { text: t('breadcrumb.genStructuredData'), href: RouterEnum.DataGenerateStructured.path },
  ];

  const modalProps = {
    showModal,
    setShowModal
  };

  return (
    
    <AppLayout
      contentHeader={<AddStructuredDataHeader />}
      tools={
        <HelpInfo
          title={t('breadcrumb.connectSource')}
          description={t('info:connect.desc')}
          linkItems={[
            {
              text: t('info:connect.addAWSAccount'),
              href: buildDocLink(i18n.language, '/user-guide/data-source/'),
            },
          ]}
        />
      }
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
            "定义数据中必须包含的字段及类型，没有特意指定请点击下一步跳过...",
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
        { id: "comment", header: "说明", cell: e => e.comment },
        { id: "operation", header: "操作", cell: e => <>   </> }
      ]}
      columnDisplay={[
        { id: "name", visible: true },
        { id: "type", visible: true },
        { id: "comment", visible: true }
      ]}
      items={currentPageItems}
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
          filteringPlaceholder="查找..."
          filteringText=""
        />
      }
      header={
        <Header
          counter={
            selectedItems.length
              ? "(" + selectedItems.length + "/"+customizeFields.length+")"
              : "("+customizeFields.length+")"
          }
          actions={
            <SpaceBetween
              direction="horizontal"
              size="xs"
            >
              <Button disabled={removeDisabled} onClick={()=>removeFields()}>移除自定义字段</Button>
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
        <Pagination
          currentPageIndex={currentPage}
          onChange={({ detail }) =>
            changePage(detail.currentPageIndex)
            // setCurrentPage()
          }
          pagesCount={Math.ceil(customizeFields.length/pageSize)} />
      }
      preferences={
        <CollectionPreferences
          title="偏好设置"
          confirmLabel="确认"
          cancelLabel="取消"
          onConfirm={({ detail }) => {
            console.log("===== detail.pageSize is:"+detail.pageSize)
            setPageSize(detail.pageSize || 10);
            // changePage(1)
          }}
          preferences={{pageSize: pageSize}}
          
          pageSizePreference={{
            title: "每页展示",
            options: [
              { value: 10, label: "10 条记录" },
              { value: 20, label: "20 条记录" }
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
          // stickyColumnsPreference={{
          //   firstColumns: {
          //     title: "Stick first column(s)",
          //     description:
          //       "Keep the first column(s) visible while horizontally scrolling the table content.",
          //     options: [
          //       { label: "None", value: 0 },
          //       { label: "First column", value: 1 },
          //       { label: "First two columns", value: 2 }
          //     ]
          //   },
          //   lastColumns: {
          //     title: "Stick last column",
          //     description:
          //       "Keep the last column visible while horizontally scrolling the table content.",
          //     options: [
          //       { label: "None", value: 0 },
          //       { label: "Last column", value: 1 }
          //     ]
          //   }
          // }}
        />
      }
    />
    
            // </Container>
          )
        },
        {
          title: "设置其他参数",
          description:
            "配置一些必要的参数,更多请点击高级配置...",
          content: (
            <Container
              footer={
                <ExpandableSection
                  header="高级配置"
                  variant="footer"
                >
                  <SpaceBetween direction='vertical' size="s">
                  <FormField
                    description="如果不希望出现某个类型，可以将该类型的概率配置为0，但是总的概率只和必须为1."
                    label="随机生成的属性类型以及出现的概率"
                  >
                    <Grid
                      disableGutters
                      gridDefinition={new Array(RANDOM_TYPE.length).fill({ colspan: 4 })}
                    >
                      {RANDOM_TYPE.map(item=>{
                        return (
                          <div style={{marginBottom:10}}>
                          <Grid
                            gridDefinition={[{ colspan: 5 },{ colspan: 5 }]}
                          > 
                            {/* <div style={{marginBottom:10}}> */}
                            <Input disabled value={item.name}/>
                            <Input value={item.probability.toString()}/>
                            {/* </div> */}
                          </Grid>
                          </div>
                          )
                      })}
                      {/* <div>col-10</div>
                      <div>col-10</div>
                      <div>col-10</div>
                      <div>col-10</div>
                      <div>col-10</div>
                      <div>col-10</div>
                      <div>col-10</div> */}
                    </Grid>
              </FormField>
              <FormField
                description="自定义字符串的最大长度最小长度."
                label="随机生成的字符串的长度"
              >
                <Grid
                  gridDefinition={[{ colspan: 5 },{ colspan: 5 }]}
                >
                <div>
                <FormField
                description="最小长度">
                <Input
                  type='number'
                  value={DEFAULT_CONFIG.minLength.toString()}
                  onChange={event =>
                    setObjectPrefix(event.detail.value)
                  }
                  />
                </FormField>
                </div>
                <div>
                <FormField
                description="最大长度">
                <Input
                  type='number'
                  value={DEFAULT_CONFIG.maxLength.toString()}
                  onChange={event =>
                    setObjectPrefix(event.detail.value)
                  }
                  />
                </FormField>
                </div>
                </Grid>
              </FormField>
              <FormField
                description="自定义整数和小数的位数."
                label="随机生成的浮点数的位数"
              >
                <Grid
                  gridDefinition={[{ colspan: 5 },{ colspan: 5 }]}
                >
                <div>
                <FormField
                description="整数部分最大位数">
                <Input
                  type='number'
                  value={DEFAULT_CONFIG.maxIntLength.toString()}
                  onChange={event =>
                    setObjectPrefix(event.detail.value)
                  }
                  />
                </FormField>
                </div>
                <div>
                <FormField
                description="小数部分最大位数">
                <Input
                  type='number'
                  value={DEFAULT_CONFIG.maxDecimalLength.toString()}
                  onChange={event =>
                    setObjectPrefix(event.detail.value)
                  }
                  />
                </FormField>
                </div>
                </Grid>
              </FormField>
              <FormField
                description="自定义日期格式的范围."
                label="随机生成的日期的范围"
              >
                <Grid
                  gridDefinition={[{ colspan: 5 },{ colspan: 5 }]}
                >
                <div>
                <FormField
                  constraintText="使用 YYYY/MM/DD 格式."
                  description="起始日期"
                >
                  <DatePicker
                    onChange={({ detail }) => setStartDate(detail.value)}
                    value={startDate}
                    openCalendarAriaLabel={selectedDate =>
                      "Choose certificate expiry date" +
                      (selectedDate
                        ? `, selected date is ${selectedDate}`
                        : "")
                    }
                    placeholder="YYYY/MM/DD"
                  />
                </FormField>
                </div>
                <div>
                <FormField
                  constraintText="使用 YYYY/MM/DD 格式."
                  description="结束日期"
                >
                  <DatePicker
                    onChange={({ detail }) => setStartDate(detail.value)}
                    value={endDate}
                    openCalendarAriaLabel={selectedDate =>
                      "Choose certificate expiry date" +
                      (selectedDate
                        ? `, selected date is ${selectedDate}`
                        : "")
                    }
                    placeholder="YYYY/MM/DD"
                  />
                </FormField>
                </div>
                </Grid>
              </FormField>
              </SpaceBetween>
                </ExpandableSection>
              }
              header={
                <Header
                  variant="h2"
                  description="用于通用参数设置"
                  
                >
                  参数配置
                </Header>
              }
            >
              <SpaceBetween direction='vertical' size='s'>
              <FormField
                description="生成的数据实体将以指定的前缀名命名，多个数据实体则会以XXX_01的形式体现."
                label="数据实体的前缀名"
              >
                <Input
                  value={objectPrefix}
                  onChange={event =>
                    setObjectPrefix(event.detail.value)
                  }
                />
              </FormField>
              <FormField
                description="自定义数据实体个数，更多细节请查看帮助文档."
                label="数据实体的个数"
              >
                <Input
                  value={objectNum.toString()}
                  type="number"
                  onChange={event =>
                    setObjectNum(parseInt(event.detail.value))
                  }
                />
              </FormField>
              <FormField
                description="自定义数据实体属性，当前已经自定义属性个数: 12."
                label="每一个实体的属性个数"
              >
                <Input
                  value={itemFieldNum.toString()}
                  type="number"
                  onChange={event =>
                    setItemFieldNum(parseInt(event.detail.value))
                  }
                />
              </FormField>
              </SpaceBetween>
            </Container>
          )
        },
        {
          title: "选择导出方式",
          description:
            "目前支持本地下载以及数据注入到云服务终端（RDS/S3/Redshift 等）...",
          content: (
            <Container
              header={
                <Header
                  variant="h2"
                  description="请选择导出方式"  
                >
                  导出方式
                </Header>
              }
            >
              <SpaceBetween direction="vertical" size="l">
              <Tiles
                onChange={({ detail }) => setOutputType(detail.value)}
                value={outputType}
                items={[
                  {
                    label: "本地",
                    description: "支持以csv/excel/sql/json形式下载",
                    value: "Local"
                  },{
                    label: "云服务",
                    description: "支持注入到AWS(S3/RDS/Redshift)",
                    value: "Cloud"
                  },{
                    label: "独立终端",
                    description: "支持注入到公网存储终端(JDBC等)",
                    value: "Individual"
                  }]
                }
              />
              {outputType==="Local"?(
                <FormField
                  description="请选择您需要的导出形式"
                  label="下载格式"
                >
                  <RadioGroup
                    onChange={({ detail }) => setOutputFormat(detail.value)}
                    value={outputFormat}
                    items={[
                      { value: "csv", label: "CSV" },
                      { value: "excel", label: "XLSX" },
                      { value: "sql", label: "SQL" },
                      { value: "json", label: "JSON" }
                    ]}
                  />
                </FormField>
              ):(outputType==="Cloud"?(
                <>
                <FormField
                  description="请选择您需要的注入的终端所在的账号"
                  label="云账号"
                >
                  <Grid
                  gridDefinition={[{ colspan: 5 },{ colspan: 5 }]}
                >
                <div>
                <FormField
                  description="账号ID"
                >
                  <Select
                    selectedOption={targetAccount}
                    onChange={({ detail }) =>
                      setTargetAccount(detail.selectedOption)
                    }
                    options={[
                      {
                        label: "2324432223",
                        value: "1|cn-northwest-1|2324432223",
                        tags: ["AWS", "cn-northwest-1"]
                      },
                      {
                        label: "8888888888",
                        value: "1|cn-north-1|2324432223",
                        tags: ["AWS", "cn-north-1"]
                      }
                    ]}
                  /> 
                </FormField>
                </div>
                <div>
                <FormField
                  description="区域"
                >
                  <Select
                    selectedOption={targetRegion}
                    onChange={({ detail }) =>
                      setTargetRegion(detail.selectedOption)
                    }
                    options={[
                      {
                        label: "cn-north-1",
                        value: "cn-north-1",
                        tags: ["AWS", "cn-northwest-1"]
                      },
                      {
                        label: "cn-northwest-1",
                        value: "cn-northwest-1",
                        tags: ["AWS", "cn-north-1"]
                      }
                    ]}
                  />
                
                </FormField>
                </div>
                </Grid>


                  
                </FormField>
                <FormField
                  description="请选择您需要的注入的云服务"
                  label="服务类型"
                >
                  <Select
                    selectedOption={targetService}
                    onChange={({ detail }) =>
                      setTargetService(detail.selectedOption)
                    }
                    options={[
                      {
                        label: "S3",
                        value: "S3",
                        iconUrl: "/imgs/s3.png",
                        tags: ["AWS", "cn-northwest-1"]
                      },
                      {
                        label: "RDS",
                        value: "RDS",
                        iconUrl: "/imgs/rds.png",
                        tags: ["AWS", "cn-north-1"]
                      },
                      {
                        label: "Redshift",
                        value: "Redshift",
                        iconUrl: "/imgs/redshift.png",
                        tags: ["AWS", "cn-north-1"]
                      }
                    ]}
                  />
                </FormField>
                </>):(
                  <>
                  <FormField
                  description="请选择您需要的注入的独立终端"
                  label="终端类型"
                >
                  <Select
                    selectedOption={targetEndpoint}
                    onChange={({ detail }) =>
                      setTargetEndpoint(detail.selectedOption)
                    }
                    options={[
                      {
                        label: "JDBC",
                        value: "JDBC",
                        iconUrl: "/imgs/jdbc.png",
                      },{
                        label: "OSS",
                        value: "oss",
                        iconUrl: "/imgs/jdbc.png",
                      }
                    ]}
                  />
                </FormField>
                  </>
                )
              )

              }
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
      {showModal && <CustomizeFieldModal {...modalProps} changeCustomizeFields={changeCustomizeFields} />}
        </ContentLayout>
      }
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigation={<Navigation activeHref={RouterEnum.DataGenerate.path} />}
      navigationWidth={290}
    />
    
  );
};

export default AddStructuredData;
