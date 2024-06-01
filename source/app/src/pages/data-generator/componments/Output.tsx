import React, { useState } from 'react';
import SpaceBetween from "@cloudscape-design/components/space-between";
import { Button, Container, FormField, Grid, Header, RadioGroup, Select, Tiles } from '@cloudscape-design/components';
import { Link, useNavigate } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';


interface OutputProps{
    outputConfig: any
    targetAccountError: string
    targetRegionError: string
    targetServiceError: string
    targetInstanceError: string
    changeOutputType: (type:string)=>void
    changeOutputFormat: (format:string)=>void
    changeTargetAccount: (format: any)=>void
    changeTargetRegion: (region: any)=>void
    changeTargetService: (service: any)=>void
    changeTargetInstance: (instance: any)=>void
    changeTargetEndpoint: (endpoint: any)=>void
}

  
const Output: React.FC<OutputProps> = (props:OutputProps) => {
  const {
    outputConfig,
    targetAccountError,
    targetRegionError,
    targetServiceError,
    targetInstanceError,
    changeOutputType,
    changeOutputFormat,
    changeTargetAccount,
    changeTargetRegion,
    changeTargetService,
    changeTargetInstance,
    changeTargetEndpoint
  } = props

  const navigate = useNavigate()

  const addAccount = () => {
    navigate(RouterEnum.Account.path)
  }
  return (
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
                onChange={({ detail }) => changeOutputType(detail.value)}
                value={outputConfig.outputType}
                items={[
                  {
                    label: "本地",
                    description: "支持以csv/excel/sql/json形式下载",
                    value: "Local",
                    disabled:true
                  },{
                    label: "云服务",
                    description: "支持注入到AWS(S3/RDS/Redshift)",
                    value: "Cloud"
                  },{
                    label: "独立终端",
                    description: "支持注入到公网存储终端(JDBC等)",
                    value: "Individual",
                    disabled: true
                  }]
                }
              />
              {outputConfig.outputType==="Local"?(
                <FormField
                  description="请选择您需要的导出形式"
                  label="下载格式"
                >
                  <RadioGroup
                    onChange={({ detail }) => changeOutputFormat(detail.value)}
                    value={outputConfig.outputFormat}
                    items={[
                      { value: "csv", label: "CSV" },
                      { value: "excel", label: "XLSX" },
                      { value: "sql", label: "SQL" },
                      { value: "json", label: "JSON" }
                    ]}
                  />
                </FormField>
              ):(outputConfig.outputType==="Cloud"?(
                <>
                <FormField
                  description="请选择您需要的注入的终端所在的账号"
                  label="云账号"
                >
                  <Grid
                  gridDefinition={[{ colspan: 4 },{ colspan: 4 },{ colspan: 4 }]}
                >
                <div>
                <FormField
                  description="账号ID"
                  errorText={targetAccountError}
                >
                  <Select
                    selectedOption={outputConfig.targetAccount}
                    placeholder='请选择云账号对应的ID'
                    onChange={({ detail }) =>
                      changeTargetAccount(detail.selectedOption)
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
                  errorText={targetRegionError}
                >
                  <Select
                    placeholder='请选择对应区域'
                    selectedOption={outputConfig.targetRegion}
                    onChange={({ detail }) =>
                      changeTargetRegion(detail.selectedOption)
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
                <div style={{paddingTop:30,paddingLeft:60}}>
                    <span style={{fontSize:12,color:'rgb(95, 107, 122)'}}>下拉列表没有目标账号？点</span><Link to={RouterEnum.Account.path}> 这里 </Link><span style={{fontSize:12,color:'rgb(95, 107, 122)'}}>追加</span>
                    {/* <Button onClick={addAccount}>没有目标账号？点击添加</Button> */}
                </div>
                </Grid>


                  
                </FormField>
                <FormField
                  description="请选择您需要的注入的云服务"
                  label="服务类型"
                  errorText={targetServiceError}
                >
                  <Select
                    placeholder='请选择目标服务'
                    selectedOption={outputConfig.targetService}
                    onChange={({ detail }) =>
                      changeTargetService(detail.selectedOption)
                    }
                    options={[
                      {
                        label: "S3",
                        value: "S3",
                        iconUrl: "/imgs/s3.png",
                        tags: ["AWS", "cn-northwest-1"],
                        disabled: true
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
                        tags: ["AWS", "cn-north-1"],
                        disabled: true
                      }
                    ]}
                  />
                </FormField>
                <FormField
                  description="请选择您需要的注入的实例"
                  label="终端实例"
                  errorText={targetInstanceError}
                >
                  <Select
                    placeholder='请选择目标实例'
                    selectedOption={outputConfig.targetInstance}
                    onChange={({ detail }) =>
                      changeTargetInstance(detail.selectedOption)
                    }
                    options={[
                      {
                        label: "database-1",
                        value: "database-1.cluster-cygq2aemjqku.rds.cn-northwest-1.amazonaws.com.cn",
                        tags: ["database-1.cluster-cygq2aemjqku.rds.cn-northwest-1.amazonaws.com.cn"]
                      },
                      {
                        label: "database-mysql",
                        value: "database-mysql.cygq2aemjqku.rds.cn-northwest-1.amazonaws.com.cn",
                        tags: ["database-mysql.cygq2aemjqku.rds.cn-northwest-1.amazonaws.com.cn"]
                      },
                      {
                        label: "database-mysql2",
                        value: "database-mysql.cygq2aemjqku.rds.cn-northwest-1.amazonaws.com.cn",
                        tags: ["database-mysql.cygq2aemjqku.rds.cn-northwest-1.amazonaws.com.cn"]
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
                    selectedOption={outputConfig.targetEndpoint}
                    onChange={({ detail }) =>
                      changeTargetEndpoint(detail.selectedOption)
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
  );
};

export default Output;
