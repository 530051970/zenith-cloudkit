import React from 'react';
import SpaceBetween from "@cloudscape-design/components/space-between";
import {
    Box,
  Button,
  ColumnLayout,
  Container,
  FormField,
  Header,
  Input
} from '@cloudscape-design/components';

interface PreviewProps{
    taskName: string,
    taskNameError: string,
    config: any,
    outputConfig: any,
    customLen: number,
    setTaskName: (name:string) => void,
    setActiveStepIndex: (step:number) => void,
    setTaskNameError: (error:string) => void,
}

const ValueWithLabel = ({ label, children }:{label:any, children:any}) => (
    <div>
      <Box variant="awsui-key-label">{label}</Box>
      <div>{children}</div>
    </div>
  );
  
const Preview: React.FC<PreviewProps> = (props:PreviewProps) => {
    const {taskName, taskNameError, config, outputConfig, customLen, setTaskName, setActiveStepIndex, setTaskNameError} = props
    
    const changeTaskName = (name:string) => {
        setTaskName(name)
        setTaskNameError("")
    }
  return (
    <SpaceBetween size="xs">
              <Container
                header={<Header variant="h3">任务名称</Header>}
              >
                <FormField
                description="请为本次任务取一个名字，长度在2-40之间"
                label="自定义任务名称"
                errorText={taskNameError}
              >
                <Input
                  value={taskName}
                  onChange={event =>
                    changeTaskName(event.detail.value)
                  }
                />
              </FormField>
              </Container>
              <Container
                header={
                  <Header variant="h3"
                  actions={
                    <Button
                      onClick={() => setActiveStepIndex(0)}
                    >
                      重新编辑
                    </Button>
                  }
                  >
                    任务预览
                  </Header>
                }
              >
                <ColumnLayout columns={3} variant="text-grid">
      <SpaceBetween size="l">
        <ValueWithLabel label="表的前缀">{config.prefix}</ValueWithLabel>
        <ValueWithLabel label="每一张表的列数">
          {config.colNum}<span style={{fontSize:10, color:'grey'}}> (其中自定义列：</span><span style={{color:'rgb(0, 7, 22)', fontSize:16}}>{customLen}</span><span style={{fontSize:10, color:'grey'}}> )</span>
        </ValueWithLabel>
        <ValueWithLabel label="输出目标类型">
          {outputConfig.targetService.label}
        </ValueWithLabel>
      </SpaceBetween>
      <SpaceBetween size="l">
        
        <ValueWithLabel label="表的总数">
        {config.tableNum}
        </ValueWithLabel>
        <ValueWithLabel label="导出方式">
        {outputConfig.outputType}
        </ValueWithLabel>
        <ValueWithLabel label="输出实例">
        {outputConfig.targetInstance.label}
        </ValueWithLabel>
      </SpaceBetween>
      <SpaceBetween size="l">
        <ValueWithLabel label="每一张表的行数">
          {config.rowNum}
        </ValueWithLabel>
        <ValueWithLabel label="账号信息">
          {outputConfig.targetAccount.label} / {outputConfig.targetRegion.label}
        </ValueWithLabel>
      </SpaceBetween>
    </ColumnLayout>
                
              </Container>
            </SpaceBetween>
  );
};

export default Preview;