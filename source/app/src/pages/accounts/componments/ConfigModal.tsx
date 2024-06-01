import { Button, FormField, Grid, Header, Input, SpaceBetween, Textarea } from "@cloudscape-design/components";
import RightModal from "pages/right-modal"
import { useState } from "react";

const ConfigModal = (props: any) => {
    const { showModal, setShowModal } = props;
    const [policy, setPolicy] = useState('' as string)

    const save = ()=>{
      setShowModal(false)
    }
    const cancel = ()=>{
      setShowModal(false)
    }

    return(
        <RightModal 
          showModal={showModal}
          setShowModal={setShowModal}
          showFolderIcon={false}
        >
          <div style={{marginTop:-20,marginLeft:20,width:"81%",height:"83%",marginBottom:20}}>
            <div style={{marginBottom:15}}>
              <Header
                variant="h2"
                description="添加要定义的账号..."
              >
                账号配置
              </Header>
            </div>
            <SpaceBetween direction="vertical" size="m">
              <FormField
                description="请输入所配置的账号"
                label="账号ID"
              >
                <Input value={""} placeholder="请输入需要配置的账号..."/>
              </FormField>
              <FormField
                description="用于描述配置的目的，用途等"
                label="描述"
              >
                <Input value={""} placeholder="请输入需要配置的账号..."/>
              </FormField>
              <FormField
                description="配置访问令牌"
                label="访问令牌"
              >
                <Input value={""} placeholder="请输入访问令牌..."/>
              </FormField>
              <FormField
                description="用于配置密钥..."
                label="密钥"
              >
                <Input value={""} placeholder="请输入密钥..."/>
              </FormField>
              <FormField
                description="配置权限策略"
                label="权限策略"
              >
                <Textarea
                  onChange={({ detail }) => setPolicy(detail.value)}
                  value={policy}
                  rows={20}
                  placeholder="请输入策略json字符串"
                />
              </FormField>
              <Grid
      gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}
    >
      <div style={{paddingLeft: 100,paddingTop: 10, color: "gray", fontSize: 12}}></div>
      <div>
      <div style={{float:"right"}}><Button variant="primary"  onClick={()=>save()}>确定</Button></div>
      <div style={{float:"right",marginRight:"10px"}}><Button onClick={()=>cancel()}>取消</Button></div>
      </div>
    </Grid>
            </SpaceBetween>

          </div>
        </RightModal>
    )
}

export default ConfigModal