import React, { useEffect, useState } from 'react';
import Wizard from "@cloudscape-design/components/wizard";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Modal,
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
import { PARAM_CONFIG, OUTPUT_CONFIG, RANDOM_TYPE } from './types/field_config';
import { set } from 'lodash';
import Preview from './componments/Preview';
import Output from './componments/Output';

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
  const { t, i18n } = useTranslation();
  const [removeDisabled, setRemoveDisabled] = useState(true)
  const [editDisabled, setEditDisabled] = useState(true)
  const [pageSize, setPageSize] =  useState(10)
  const [config, setConfig] = useState(PARAM_CONFIG as any)
  const [outputConfig, setOutputConfig] = useState(OUTPUT_CONFIG as any)
  // const [outputType, setOutputType] = useState(DEFAULT_CONFIG.outputType)
  // const [outputFormat, setOutputFormat] = useState(DEFAULT_CONFIG.outputFormat)
  // const [targetAccount, setTargetAccount] = useState({} as any)
  // const [targetService, setTargetService] = useState({} as any)
  // const [targetEndpoint, setTargetEndpoint] = useState({} as any)
  // const [targetRegion, setTargetRegion] = useState({} as any)
  const [targetAccountError, setTargetAccountError] = useState('' as string)
const [targetRegionError, setTargetRegionError] = useState('' as string)
const [targetServiceError, setTargetServiceError] = useState('' as string)
const [targetInstanceError, setTargetInstanceError] = useState('' as string)
  const [showEditModal, setShowEditModal] = useState(false)
  const [changeFieldError, setChangeFieldError] = useState('' as string)
  const [prefixError, setPrefixError] = useState('' as string)
  const [rType, setRType] = useState(RANDOM_TYPE as any[])
  const [randomSum, setRandomSum]= useState(100 as number)
  const [randomSumError, setRandomSumError] = useState('' as string)
  const [ver, setVer] = useState(1 as number)
  const [taskName, setTaskName] = useState('' as string)
  const [taskNameError, setTaskNameError] = useState('' as string)
  const navigate = useNavigate();

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
  ] = React.useState([] as any);

  const [
    newFieldName,
    setNewFieldName
  ] = React.useState('' as string);

  useEffect(()=>{
    changePage(1)
  },[pageSize, customizeFields])

  // useEffect(()=>{
  //   changePage(1)
  // },[pageSize, customizeFields])

  useEffect(()=>{
    console.log("changeFieldError")
    // changePage(1)
    // setChangeFieldError(changeFieldError)
  },[changeFieldError,rType])

  useEffect(()=>{
    if(selectedItems.length === 0){
      setRemoveDisabled(true)
      setEditDisabled(true)
    } else {
      setRemoveDisabled(false)
      if(selectedItems.length === 1){
        setEditDisabled(false)
        setNewFieldName(selectedItems[0].name)
      } else {
        setEditDisabled(true)
        setNewFieldName('' as string)
      }
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

  const changeObjectNum = (value: number)=>{
    if(value===0) return
    let tmpVer = ver+1
    let tmpConfg = config
    tmpConfg.tableNum = value
    setConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeRowNum = (value: number)=>{
    let tmpVer = ver+1
    if(value===0) return
    let tmpConfg = config
    tmpConfg.rowNum = value
    setConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeItemFieldNum = (value: number)=>{
    let tmpVer = ver+1
    if(value===0) return
    let tmpConfg = config
    tmpConfg.colNum = value
    setConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeMinLen = (value: number) =>{
    let tmpVer = ver+1
    let tmpConfg = config
    if(value===0) return
    tmpConfg.minLength = value
    setConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeMaxLen = (value: number) =>{
    let tmpVer = ver+1
    let tmpConfg = config
    if(value===0) return
    tmpConfg.maxLength = value
    setConfig(tmpConfg)
    setVer(tmpVer)
  }

  // maxIntLength: 5,
  // maxDecimalLength: 5,
  // startDate: "1970-01-01",
  // endDate: "2050-12-31",
  // outputType: "Local",
  // outputFormat: "excel"

  const changeMaxInteger = (value: number) =>{
    let tmpVer = ver+1
    let tmpConfg = config
    if(value===0) return
    tmpConfg.maxIntLength = value
    setConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeMaxDecimal = (value: number) =>{
    let tmpVer = ver+1
    let tmpConfg = config
    if(value===0) return
    tmpConfg.maxDecimalLength = value
    setConfig(tmpConfg)
    setVer(tmpVer)
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

  const changeStartDate = (date: string)=>{
    let tmpVer = ver+1
    let tmpConfg = config
    tmpConfg.startDate = date
    setConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeEndDate = (date: string)=>{
    let tmpVer = ver+1
    let tmpConfg = config
    tmpConfg.endDate = date
    setConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changePrefix = (value:string) =>{
      let tmpConfg = config
      let tmpVer = ver+1
      tmpConfg.prefix = value
      setConfig(tmpConfg)
      setVer(tmpVer)
      if(value===null || value.trim()===''){
        setPrefixError("表的前缀名不能为空")
      } else {
        setPrefixError("")
      }
  }

  const chanteProbability = (type:string,value:number) =>{
    let delta = 0
    if(value<0) return
    const tmpRType = rType
    for(const item of tmpRType){
      if(item.id === type){
        delta =  value - item.probability
        item.probability = value
        break
     }
    }
    setRType(tmpRType)
    console.log(`tmpRType is ${tmpRType}`)
    const tmpRandomSum = randomSum + delta
    setRandomSum(tmpRandomSum)
    if(tmpRandomSum > 100){
      setRandomSumError("当前的概率总和大于100，请调整各类型比例分布")
    } else {
      setRandomSumError("")
    }
    // console.log(`value is ${value}`)
  }

  const editField = ()=>{
     setShowEditModal(true)
  }

  const changeFieldName = (value: any)=>{
    let isValid = true
    if(value===null || value===''){
      setChangeFieldError('字段名不能为空')
    } else {
      setChangeFieldError('')
    }
    for(let i = 0; i<customizeFields.length; i++){
      if(customizeFields[i].name === value && selectedItems[0].name !== value){
        setChangeFieldError('字段名不能与其他字段名重复');
        isValid =false
        break;
      }
    }
    if(isValid) {
      setChangeFieldError('')
    }
    setNewFieldName(value)
  }

  const changeOutputType = (value:string) => {
    let tmpVer = ver+1
    let tmpConfg = outputConfig
    tmpConfg.outputType = value
    setOutputConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeOutputFormat = (value:string) => {
    let tmpVer = ver+1
    let tmpConfg = outputConfig
    tmpConfg.outputFormat = value
    setOutputConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeTargetRegion = (region:any) => {
    let tmpVer = ver+1
    let tmpConfg = outputConfig
    tmpConfg.targetRegion = region
    setOutputConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeTargetAccount = (account:any) => {
    let tmpVer = ver+1
    let tmpConfg = outputConfig
    tmpConfg.targetAccount = account
    setOutputConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeTargetService = (service:any) => {
    let tmpVer = ver+1
    let tmpConfg = outputConfig
    tmpConfg.targetService = service
    setOutputConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeTargetInstance = (instance:any) => {
    let tmpVer = ver+1
    let tmpConfg = outputConfig
    tmpConfg.targetInstance = instance
    setOutputConfig(tmpConfg)
    setVer(tmpVer)
  }

  const changeTargetEndpoint = (endpoint:any) => {
    let tmpVer = ver+1
    let tmpConfg = outputConfig
    tmpConfg.targetEndpoint = endpoint
    setOutputConfig(tmpConfg)
    setVer(tmpVer)
  }



  const saveField = () =>{
     let fields = customizeFields
     fields.forEach((item:Field) => {
       if(item.name === selectedItems[0].name){
         item.name = newFieldName;
         return
       }
     });
     setCustomizeFields(fields)

     let tmpItem = selectedItems[0]
     tmpItem.name = newFieldName
     setSelectedItems([tmpItem])
     setShowEditModal(false)
  }

  const cancelField = ()=>{
    setNewFieldName(selectedItems[0].name)
    setShowEditModal(false)
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
        navigationAriaLabel: "Steps",
        cancelButton: "取消",
        previousButton: "上一步",
        nextButton: "下一步",
        submitButton: "启动任务",
        optional: "可选"
      }}
      onSubmit={()=>{
        if(taskName===null || taskName.length<2 || taskName.length >40) {
          setTaskNameError("任务名称必须在2-40个字符之间") 
          return
        } else {
          setTaskNameError("")
        }
        navigate(RouterEnum.DataGenerate.path)
      }}
      onNavigate={({ detail }) => {
        
        if(detail.requestedStepIndex === 2 ){
          if(prefixError!=="" || randomSumError !==""){
            return
          }
        }
        if(detail.requestedStepIndex === 3 ){
          if(outputConfig.targetAccount === null || outputConfig.targetAccount ===""){
            setTargetAccountError("账号为必填项，请选择目标账号")
            return
          }
          if(outputConfig.targetRegion === null || outputConfig.targetRegion ===""){
            setTargetAccountError("")
            setTargetRegionError("区域为必填项，请选择目标区域")
            return
          }
          if(outputConfig.targetService === null || outputConfig.targetService ===""){
            setTargetAccountError("")
            setTargetRegionError("")
            setTargetServiceError("服务为必填项，请选择目标服务")
            return
          }
          if(outputConfig.targetInstance === null || outputConfig.targetInstance ===""){
            setTargetAccountError("")
            setTargetRegionError("")
            setTargetServiceError("")
            setTargetInstanceError("实例为必填项，请选择目标实例")
            return
          }
        }
        setActiveStepIndex(detail.requestedStepIndex)
        }
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
              <Button disabled={editDisabled} onClick={()=>editField()}>编辑自定义字段</Button>
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
                    description="如果不希望出现某个类型，可以将该类型的概率配置为0，但是总的分布总和必须为100."
                    label="随机生成的属性类型以及出现的概率"
                    errorText={randomSumError}
                  >
                    <Grid
                      disableGutters
                      gridDefinition={new Array(rType.length).fill({ colspan: 4 })}
                    >
                      {rType.map(item=>{
                        return (
                          <div style={{marginBottom:10}}>
                          <Grid
                            gridDefinition={[{ colspan: 5 },{ colspan: 5 }]}
                          > 
                            {/* <div style={{marginBottom:10}}> */}
                            <Input disabled value={item.name}/>
                            <Input type="number" value={item.probability.toString()} onChange={event=>{chanteProbability(item.id, parseFloat(event.detail.value))}}/>
                            {/* </div> */}
                          </Grid>
                          </div>
                          )
                      })}
                      <div style={{display:"none"}}>{ver}</div>
                      <div style={{display:"none"}}>{randomSum}</div>
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
                  value={config.minLength.toString()}
                  onChange={event =>
                    changeMinLen(parseFloat(event.detail.value))
                  }
                  />
                </FormField>
                </div>
                <div>
                <FormField
                description="最大长度">
                <Input
                  type='number'
                  value={config.maxLength.toString()}
                  onChange={event =>
                    changeMaxLen(parseFloat(event.detail.value))
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
                  value={config.maxIntLength.toString()}
                  onChange={event =>
                    changeMaxInteger(parseFloat(event.detail.value))
                  }
                  />
                </FormField>
                </div>
                <div>
                <FormField
                description="小数部分最大位数">
                <Input
                  type='number'
                  value={config.maxDecimalLength.toString()}
                  onChange={event =>
                    changeMaxDecimal(parseFloat(event.detail.value))
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
                    onChange={({ detail }) => changeStartDate(detail.value)}
                    value={config.startDate}
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
                    onChange={({ detail }) => changeEndDate(detail.value)}
                    value={config.endDate}
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
                description="指定生成表的前缀名XXX，多个表则会以XXX_01、XXX_02...的形式体现, 默认为demo"
                label="表的前缀名"
                errorText={prefixError}
              >
                <Input
                  value={config.prefix}
                  onChange={event =>
                    changePrefix(event.detail.value)
                  }
                />
              </FormField>
              <FormField
                description="自定义表个数，默认50张表"
                label="表的个数"
              >
                <Input
                  value={config.tableNum.toString()}
                  type="number"
                  onChange={event =>
                    changeObjectNum(parseInt(event.detail.value))
                  }
                />
              </FormField>
              <FormField
                description="自定义表行数，默认100行"
                label="表的行数"
              >
                <Input
                  value={config.rowNum.toString()}
                  type="number"
                  onChange={event =>
                    changeRowNum(parseInt(event.detail.value))
                  }
                />
              </FormField>
              <FormField
                description={`自定义表列数，当前已经自定义 ${customizeFields.length} 列，默认总的列数为50`}
                label="每一个表的列数"
              >
                <Input
                  value={config.colNum.toString()}
                  type="number"
                  onChange={event =>
                    changeItemFieldNum(parseInt(event.detail.value))
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
            <Output 
              outputConfig={outputConfig}
              targetAccountError={targetAccountError}
              targetRegionError={targetRegionError}
              targetServiceError={targetServiceError}
              targetInstanceError={targetInstanceError}
              changeOutputType={changeOutputType}
              changeOutputFormat={changeOutputFormat}
              changeTargetAccount={changeTargetAccount}
              changeTargetRegion={changeTargetRegion}
              changeTargetService={changeTargetService}
              changeTargetInstance={changeTargetInstance}
              changeTargetEndpoint={changeTargetEndpoint}
            />
          )
        },
        {
          title: "预览并启动任务",
          description:
            "请指定最后的数据中必须包含的字段以及类型，如果没有特意指定的请点击下一步跳过...",
          content: (
            <Preview
              taskName={taskName}
              taskNameError={taskNameError}
              config={config}
              outputConfig={outputConfig}
              customLen={customizeFields.length}
              setTaskName={setTaskName}
              setActiveStepIndex={setActiveStepIndex}
              setTaskNameError={setTaskNameError}
            />
          )
        }
      ]}
    />
      {showModal && <CustomizeFieldModal {...modalProps} changeCustomizeFields={changeCustomizeFields} />}
      {showEditModal && <Modal
      onDismiss={() => {
        setNewFieldName(selectedItems[0].name)
        setShowEditModal(false)
      }}
      visible={showEditModal}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={cancelField}> 取消</Button>
            <Button variant="primary" onClick={saveField}>保存</Button>
          </SpaceBetween>
        </Box>
      }
      header="编辑自定义字段"
    >
      <FormField
        label="字段名称"
        description="用于用户自定义字段名称"
        constraintText="字段名不能为空，且不能与现有其他字段重名."
        errorText={changeFieldError}
      >
        <Input 
          value={newFieldName}
          onChange={({detail})=>changeFieldName(detail.value)}
          />
      </FormField>
    </Modal>}
        </ContentLayout>
      }
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigationHide={true}
    />
    
  );
};

export default AddStructuredData;
