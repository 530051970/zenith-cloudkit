import React, { useEffect, useState } from 'react';
import {
  Icon,
  SpaceBetween,
  Button,
  Select,
  SelectProps,
  Header,
  FormField,
  Input,
  Grid,
  Multiselect,
} from '@cloudscape-design/components';
import RightModal from 'pages/right-modal';
import { FIELD_CONFIG_CN } from '../types/field_config';
import '../style.scss';

const CustomizeFieldModal = (props: any) => {
  const { showModal, setShowModal } = props;
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>({
    label: '',
    value: '',
  });
  const [allOption, setAllOption] = useState([] as any)
  const [selectedSubTypeOptions, setSelectedSubTypeOptions] = useState([] as any)
  const [subTypes, setSubTypes]= useState([
    {
      label: "Option 1",
      value: "1",
      description: "This is a description"
    }])
  const [checkedSubType, setCheckedSubType] = useState([] as any)
  const [disabled, setDisabled] = useState(true)
  const [typeNum, setTypeNum] = useState(0)
  const [num, setNum] = useState(0)

  useEffect(()=>{
    const topType: any[] = []
    FIELD_CONFIG_CN.forEach(obj => {
      topType.push({
        label: obj.typeName,
        value: obj.typeId
      })
    });
    setAllOption(topType)
    setSelectedOption(topType[0])
    const tmp_subTypes:any = []
    FIELD_CONFIG_CN[0].subTypes.forEach(item=>{
      tmp_subTypes.push({
        label: item.typeName,
        value: item.typeId,
        prefix: item.prefix,
        type: item.type
      })
    })
    setSubTypes(tmp_subTypes)
  },[])

  useEffect(()=>{
    FIELD_CONFIG_CN.forEach(obj => {
      if(obj.typeId === selectedOption.value){
        const tmp_subTypes:any = []
        obj.subTypes.forEach(item=>{
        tmp_subTypes.push({
          label: item.typeName,
          value: item.typeId,
          prefix: item.prefix,
          type: item.type,
          desc: obj.typeName
        })
      })
      setSubTypes(tmp_subTypes)
      }
    });
  },[selectedOption])

  useEffect(()=>{
    let tmpNum = 0
    if(checkedSubType.length === 0){
      setDisabled(true)
    } else {
      setDisabled(false)
    }
    setTypeNum(checkedSubType.length)
    checkedSubType.forEach((i:any)=>{
      tmpNum += i.cnt
    })
    setNum(tmpNum)
  },[checkedSubType])

  const addSubTypeOptions = (subTypeOptions: any)=>{
    setSelectedSubTypeOptions(subTypeOptions)
    const tmpCheckedSubtypes:any[] = []
    subTypeOptions.forEach((item:any) => {
      tmpCheckedSubtypes.push({
         label: item.label,
         tags: [item.desc],
         prefix: item.prefix,
         type: item.type,
         cnt: 1,
         id: item.value
      })
    })
    setCheckedSubType([])
    setCheckedSubType([...tmpCheckedSubtypes])
  }

  const setFieldNum = (id:any, num:any)=>{
    if(num === "0") return;
    setCheckedSubType(checkedSubType.map((item:any) => {
      if (item.id === id) {
        return { ...item, cnt: parseInt(num) };
      }
      return item;
    }))
  }

  const remove = (id:any) =>{
    setCheckedSubType(checkedSubType.filter((item:any) => {
      if (item.id !== id) {
        return item;
      }
    }))
    setSelectedSubTypeOptions(selectedSubTypeOptions.filter((item:any)=>{
      if (item.value !== id) {
        return item;
      }
    }))
  }

  const cancel = ()=>{
    setShowModal(false)
  }

  const save = ()=>{
    props.changeCustomizeFields(checkedSubType)
    setCheckedSubType([])
    setShowModal(false)
  }
  
  return (<RightModal
    
    setShowModal={setShowModal}
    showModal={showModal}
    showFolderIcon={false}
  >
    <div style={{marginTop:-20,marginLeft:20,width:"81%",height:"83%",marginBottom:20}}>
      <div style={{marginBottom:15}}>
        <Header
          variant="h2"
          description="请选择自定义字段..."
        >
          自定义字段
        </Header>
        </div>
        <SpaceBetween direction="vertical" size="m">
        <FormField
      description="请选择一级属性"
      label="一级属性"
    >
      <Select
      selectedOption={selectedOption as any}
      onChange={({ detail }) => {setSelectedOption(detail.selectedOption)}
      }
      options={allOption}
    />
    
      
    </FormField>
    <FormField
      
      description="请选择二级属性"
      label="二级属性"
    >
      <Multiselect
      selectedOptions={selectedSubTypeOptions}
      onChange={({ detail }) =>
        addSubTypeOptions(detail.selectedOptions)
      }
      hideTokens
      placeholder="请选择二级属性"
      options={subTypes}
    />
    </FormField>
    {(checkedSubType.length > 0)?(
      <div style={{height:"400px"}}>
    <FormField
      description="可以自定义字段数量,点击右侧删除字段"
      label="当前已经选择："
    >
    </FormField>
    <div style={{position: "fixed",height: "42%",overflow: "auto", marginTop:5}}>
    {checkedSubType.map((item:any)=>(
      <Grid
       key={item.id}
       gridDefinition={[{ colspan: 3 }, { colspan: 5 }, { colspan: 2 }, { colspan: 2 }]}
     >
        <Input value={item.tags[0]} disabled/>
        <Input value={item.label} disabled/>
        <Input value={item.cnt}  type="number" onChange={({ detail }) => setFieldNum(item.id, detail.value)}/>
        <Button onClick={()=>remove(item.id)}>移除</Button>
     </Grid>
    ))}
    </div>
    </div>):(
       <div style={{height:"42%",margin:"0,auto",fontSize:"15px", marginTop:5}}>
       </div>
    )}
    </SpaceBetween>

    </div>
    <div style={{width:"85%",paddingTop:20}}>
    <Grid
      gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}
    >
      <div style={{paddingLeft: 100,paddingTop: 10, color: "gray", fontSize: 12}}>
      <Icon name="status-info" /> 当前已经自定义 <span style={{color: 'black', fontWeight:"bold"}}>{typeNum}</span> 种类型，共 <span style={{color: 'black', fontWeight:"bold"}}>{num}</span> 个字段
      </div>
      <div>
      <div style={{float:"right"}}><Button variant="primary" disabled={disabled} onClick={()=>save()}>确定</Button></div>
      <div style={{float:"right",marginRight:"10px"}}><Button onClick={()=>cancel()}>取消</Button></div>
      </div>
    </Grid>
    
    
    </div>
  </RightModal>);
};

export default CustomizeFieldModal;
