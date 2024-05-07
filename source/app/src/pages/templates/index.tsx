import { AppLayout, Badge, Box, Button, ButtonDropdown, Cards, CollectionPreferences, Container, ContentLayout, Grid, Header, Link, Pagination, SpaceBetween, TextFilter } from "@cloudscape-design/components"
import CustomBreadCrumb from "pages/left-menu/CustomBreadCrumb"
import Navigation from "pages/left-menu/Navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { RouterEnum } from "routers/routerEnum";
import './style.scss';
import { BADGE } from "enum/common_types";
const TemplatesHeader: React.FC = () => {
    const { t } = useTranslation();
    
  
    return (
      <Header variant="h2" 
        actions={<Button
            ariaLabel="Report a bug (opens new tab)"
            href="https://example.com"
            iconAlign="right"
            iconName="external"
            target="_blank"
          >
            查看源代码
          </Button>}
        description={t('templates:templatesDesc')}
        >
        {t('templates:templates')}
      </Header>
    );
  };

const Templates: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { t, i18n } = useTranslation();
    const [filteringText, setFilteringText] = useState("")
    const [currentPageIndex, setCurrentPageIndex] = useState(1)
    const breadcrumbItems = [
      { text: t('breadcrumb.home'), href: RouterEnum.Home.path },
      { text: t('breadcrumb.templates'), href: RouterEnum.Templates.path },
    ];
    const templatesData = [
        {
          name: "数据生成器",
          alt: "data-generator",
          description: "海量数据的一站式提效解决方案，涵盖数据产生、传输、落库等全流程，支持自定义表结构、表和数据库的大小，能帮助您将一周的工作量缩短至天级完成",
          type: '1',
          author: "cuihubin",
          date: "2023-08-12"
        },
        {
          name: "实时数据监测",
          alt: "data-scanner",
          description: "实时检测存储介质中的各种敏感信息，支持自定义检测规则，告警规则以及多种数据源。",
          type: '1',
          author: "cuihubin",
          date: "2023-08-12"
        },
        {
          name: "数字语音助手",
          alt: "digit-voice",
          description: "为用户提供便捷的语音交互体验。通过该助手，用户可以轻松地进行语音搜索、语音指令操作、语音播报等功能。无论是查询天气、播放音乐，还是获取实时新闻，数字语音助手都能快速响应用户需求，为生活增添便利。",
          type: '2',
          author: "cuihubin",
          date: "2023-08-12"
          }
      ]
    return (<>
     <AppLayout
      contentHeader={<TemplatesHeader />}
      
      content={
        <ContentLayout className="catalog-layout">
            {/* <Cards
                ariaLabels={{
                    itemSelectionLabel: (e, t) => `select ${t.name}`,
                    selectionGroupLabel: "Item selection"
                  }}
                items={[]}
                cardDefinition={[] as any}>
            
            </Cards> */}
            <div style={{marginBottom:20}}>
            <Container>
            <div style={{marginBottom:15}}>
            <Header
              counter="(10)"
              variant="h3"
            >
              模版列表
            </Header>
            </div>
            <Grid gridDefinition={[{colspan:6},{colspan:6}]}>
                <div>
            <TextFilter
              filteringText={filteringText}
              filteringPlaceholder="输入关键词查找模版..."
              filteringAriaLabel="Filter instances"
              onChange={({ detail }) =>
                setFilteringText(detail.filteringText)
              }
            />
            </div>
            <div style={{textAlign:"right",display:"flex",justifyContent:'right'}}>
            <Pagination
              currentPageIndex={currentPageIndex}
              onChange={({ detail }) =>
                setCurrentPageIndex(detail.currentPageIndex)
              }
              pagesCount={5}
            />
            </div>
            </Grid>
            </Container>
            </div>
            <Grid gridDefinition={[{colspan:4},{colspan:4},{colspan:4}]}>
            {templatesData.map(item=>{
                return (
                    <Container
    //     media={{
    //       content: (
    //         <img
    //           src="/image-placeholder.png"
    //           alt="placeholder"
    //         />
    //       ),
    //     height: 200,
    //     position: "top"
    //   }}
      footer={
        <div className="container-media-footer">
          <Grid gridDefinition={[{colspan:6},{colspan:6}]}>
          <Badge color={BADGE.get(item.type)['color']}>{BADGE.get(item.type)['name']}</Badge>
          <div style={{fontSize:12, color:'grey',textAlign:'right'}}>{item.author} 于 {item.date} 上传</div>
          </Grid>
        </div>
      }
    >
      <SpaceBetween direction="vertical" size="s">
        {/* <SpaceBetween direction="vertical" size="xxs">
          <Box variant="small">{item.date}</Box>
          <Box variant="h3">{item.name}</Box>
        </SpaceBetween> */}
        <div>
        <img
          style={{height:150,width:'100%'}}
              src={`../../imgs/${item.alt}.png`}
              alt="placeholder"
            />
        </div>
        <div className='desc'>{item.name} - {item.description}</div>
        <Grid gridDefinition={[{colspan:10},{colspan:1}]}>
            <SpaceBetween size={"s"} direction="horizontal">
        <Button iconName="expand">查看演示</Button>
        <Button iconName="download">下载模版</Button>

        
        </SpaceBetween>
        <div style={{textAlign:'right',paddingLeft:17}}>
        <ButtonDropdown
      items={[
        { id: "contect", text: "联系作者" }
      ]}
      ariaLabel="Control instance"
      variant="icon"
    /></div>
        </Grid>
      </SpaceBetween>
    </Container>
                )
            })}

</Grid>       
            
          {/* <Cards
      ariaLabels={{
        itemSelectionLabel: (e, t) => `select ${t.name}`,
        selectionGroupLabel: "Item selection"
      }}
      cardDefinition={{
        // header:false,
        sections: [
          {
            id: "image",
            content: () => (
              <img
                style={{ width: "100%" }}
                src="../../imgs/data-generator.png"
                alt="placeholder"
              />
            )
          },
          {
            id: "description",
            
            content: item => <div className='desc'>{item.name} - {item.description}</div>
          },
          {
            id: "info",
            content: item => (<Grid gridDefinition={[{colspan: 3},{colspan:7},{colspan:2}]}>
                 <div>{item.type}</div>
                 <div style={{fontSize:12, color:'grey'}}>{item.author} 于 {item.date} 上传</div>
                 <div>VIEW</div>
                </Grid>)
          }
        ]
      }}
      cardsPerRow={[
        { minWidth: 300, cards: 3 }
      ]}
      items={templatesData}
      loadingText="Loading resources"
      trackBy="name"
      visibleSections={[
        "image",
        "description",
        "type",
        "info",
        "view"
      ]}
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
        <TextFilter filteringPlaceholder="查找模版" filteringText={""} />
      }
      header={
        <Header
          counter="(10)"
        >
          模版列表
        </Header>
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
              "author",
              "date"
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
    /> */}
        </ContentLayout>
      }
      headerSelector="#header"
      breadcrumbs={<CustomBreadCrumb breadcrumbItems={breadcrumbItems} />}
      navigation={<Navigation activeHref={RouterEnum.DataGenerate.path} />}
      navigationWidth={290}
    />
   </>)
}

export default Templates