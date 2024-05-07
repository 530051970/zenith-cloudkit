import {
  Header,
  Table,
  Box,
  SelectProps,
  Select,
  TextFilter,
} from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';
import { ITableListKeyValue } from 'ts/dashboard/types';
import '../../../style.scss';
import { useNavigate } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';

interface IdentifierTableProps {
  title: string;
  keyLable: string;
  valueLable: string;
  dataList: ITableListKeyValue[];
}

const IdentifierTableData: React.FC<IdentifierTableProps> = (
  props: IdentifierTableProps
) => {
  const { title, keyLable, valueLable, dataList } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchIdentName, setSearchIdentName] = useState('');
  const [categoryValue, setCategoryValue] = useState<SelectProps.Option>({
    label: t('allCategory') || '',
    value: '',
  });
  const [identLabelValue, setIdentLabelValue] = useState<SelectProps.Option>({
    label: t('allLabel') || '',
    value: '',
  });
  const [categoryOptionList, setCategoryOptionList] = useState<
    SelectProps.Option[]
  >([]);
  const [identLabelOptionList, setIdentLabelOptionList] = useState<
    SelectProps.Option[]
  >([]);

  const [displayTableList, setDisplayTableList] =
    useState<ITableListKeyValue[]>(dataList);

  const clkCount = (typeValue: any) => {
    if (valueLable === t('summary:s3Bucket')) {
      navigate(
        `${RouterEnum.Catalog.path}?tagType=s3&accountId=${typeValue}&privacy=1`
      );
    }

    if (
      valueLable === t('summary:rdsIntacnes') &&
      keyLable === t('summary:awsAccount')
    ) {
      navigate(
        `${RouterEnum.Catalog.path}?tagType=rds&accountId=${typeValue}&privacy=1`
      );
    }

    if (
      valueLable === t('summary:rdsIntacnes') &&
      keyLable === t('summary:dataIdentifier')
    ) {
      navigate(
        `${RouterEnum.Catalog.path}?tagType=rds&identifiers=${typeValue}`
      );
    }

    if (valueLable === t('summary:totalBuckets')) {
      navigate(
        `${RouterEnum.Catalog.path}?tagType=s3&identifiers=${typeValue}`
      );
    }
    return;
  };

  useEffect(() => {
    const containsCategoryList = dataList.map((element) => element.category);
    const uniqueCategoryListArray = Array.from(new Set(containsCategoryList));
    const tmpCategoryOptions: SelectProps.Option[] =
      uniqueCategoryListArray.map((element) => {
        return { label: element, value: element };
      });
    setCategoryOptionList([
      {
        label: t('allCategory') || '',
        value: '',
      },
      ...tmpCategoryOptions.sort((a: any, b: any) =>
        a.value?.localeCompare(b?.value)
      ),
    ]);

    const containsLabelList = dataList.map(
      (element) => element.identifierLabel
    );
    const uniqueLabelListArray = Array.from(new Set(containsLabelList));
    const tmpLabelOptions: SelectProps.Option[] = uniqueLabelListArray.map(
      (element) => {
        return { label: element, value: element };
      }
    );
    setIdentLabelOptionList([
      { label: t('allLabel') || '', value: '' },
      ...tmpLabelOptions.sort((a: any, b: any) =>
        a.value?.localeCompare(b?.value)
      ),
    ]);
  }, [dataList]);

  useEffect(() => {
    let waitFilterList = cloneDeep(dataList);
    waitFilterList = waitFilterList.filter((element) =>
      element.name
        ?.toLocaleLowerCase()
        .includes(searchIdentName.toLocaleLowerCase())
    );
    if (categoryValue.value) {
      waitFilterList = waitFilterList.filter(
        (element) => element.category === categoryValue.value
      );
    }
    if (identLabelValue.value) {
      waitFilterList = waitFilterList.filter(
        (element) => element.identifierLabel === identLabelValue.value
      );
    }
    setDisplayTableList(waitFilterList);
  }, [categoryValue, identLabelValue, searchIdentName]);

  return (
    <div>
      <Header variant="h3">{title}</Header>
      <div className="flex gap-10">
        <div className="flex-2">
          <TextFilter
            filteringText={searchIdentName}
            filteringPlaceholder={t('summary:searchByIdentName') || ''}
            onChange={({ detail }) => setSearchIdentName(detail.filteringText)}
          />
        </div>
        <div className="flex-1">
          <Select
            placeholder={t('category.category') || ''}
            selectedOption={categoryValue}
            onChange={({ detail }) => setCategoryValue(detail.selectedOption)}
            options={categoryOptionList}
          />
        </div>
        <div className="flex-1">
          <Select
            placeholder={t('identLabel.identLabel') || ''}
            selectedOption={identLabelValue}
            onChange={({ detail }) => setIdentLabelValue(detail.selectedOption)}
            options={identLabelOptionList}
          />
        </div>
      </div>
      <div className="max-table-height mt-10">
        <Table
          variant="embedded"
          columnDefinitions={[
            {
              id: 'name',
              header: keyLable,
              cell: (item) => item.name || '-',
              sortingField: 'name',
            },
            {
              id: 'data_source_count',
              header: valueLable,
              cell: (item) => {
                return (
                  (
                    <span
                      onClick={() => clkCount(item.name)}
                      className="source-count"
                    >
                      {item.data_source_count || '-'}
                    </span>
                  ) || '-'
                );
              },
              sortingField: 'data_source_count',
            },
            {
              id: 'category',
              header: t('category.category'),
              cell: (item) => {
                return item.category;
              },
            },
            {
              id: 'label',
              header: t('identLabel.identLabel'),
              cell: (item) => {
                return item.identifierLabel;
              },
            },
          ]}
          items={displayTableList}
          loadingText={t('table.loadingResources') || ''}
          sortingDisabled
          // stickyHeader
          empty={
            <Box textAlign="center" color="inherit">
              <b>{t('table.noResources')}</b>
              <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                {t('table.noResourcesDisplay')}
              </Box>
            </Box>
          }
        />
      </div>
    </div>
  );
};

export default IdentifierTableData;
