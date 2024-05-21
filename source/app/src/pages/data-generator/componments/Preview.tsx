import React from 'react';
import SpaceBetween from "@cloudscape-design/components/space-between";
import {
  Button,
  ColumnLayout,
  Container,
  Header
} from '@cloudscape-design/components';

interface PreviewProps{
    setActiveStepIndex: (step:number)=> void
}
const Preview: React.FC<PreviewProps> = (props:PreviewProps) => {
  return (
    <SpaceBetween size="xs">
              <Container
                header={
                  <Header variant="h2"
                  actions={
                    <Button
                      onClick={() => props.setActiveStepIndex(0)}
                    >
                      重新编辑
                    </Button>
                  }
                  >
                    任务预览
                  </Header>
                }
              >
                <ColumnLayout borders="horizontal" columns={3}>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
    </ColumnLayout>
                
              </Container>
            </SpaceBetween>
  );
};

export default Preview;
