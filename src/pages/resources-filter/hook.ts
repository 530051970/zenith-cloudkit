import { useEffect, useRef, useState } from 'react';
import { getPropertyValues } from 'apis/query/api';
import { PRIVARY_TYPE_INT_DATA } from 'pages/common-badge/types/badge_type';
import { TABLE_NAME } from 'enum/common_types';
import { COLUMN_OBJECT_STR } from 'pages/data-generator/types/data_config';

const asyncFetchFilteringOptions = async (params: {
  filteringText: string;
  filteringPropertyKey: any;
  table: string | undefined;
}) => {
  if (!params || !params.filteringPropertyKey || !params.table) {
    return {
      filteringOptions: [],
    };
  }
  const responseRes: any = await getPropertyValues({
    table: params.table,
    column: params.filteringPropertyKey,
  });
  if (!responseRes || responseRes.length === 0) {
    return {
      filteringOptions: [],
    };
  }
  const returnRes = responseRes.map((item: any) => {
    // 定制显示
    if (
      params.filteringPropertyKey === COLUMN_OBJECT_STR.Privacy &&
      params.table === TABLE_NAME.CATALOG_DATABASE_LEVEL_CLASSIFICATION
    ) {
      return {
        propertyKey: params.filteringPropertyKey,
        value: PRIVARY_TYPE_INT_DATA[item],
      };
    }
    if (
      params.filteringPropertyKey === 'glue_state' &&
      params.table === TABLE_NAME.SOURCE_S3_BUCKET &&
      item === 'Empty'
    ) {
      return {};
    }
    if (
      params.filteringPropertyKey === 'stack_status' &&
      params.table === TABLE_NAME.SOURCE_ACCOUNT &&
      item === 'Empty'
    ) {
      return {};
    }
    if (
      params.filteringPropertyKey === 'status' &&
      params.table === TABLE_NAME.SOURCE_ACCOUNT
    ) {
      return {
        propertyKey: params.filteringPropertyKey,
        value: item === 1 ? 'SUCCEEDED' : 'CURRENT',
      };
    }
    return {
      propertyKey: params.filteringPropertyKey,
      value: item,
    };
  });
  return {
    filteringOptions: returnRes,
  };
};

export const useDistributionsPropertyFiltering = (
  tableName: string | undefined
) => {
  const request: any = useRef({ filteringText: '' });
  const [filteringOptions, setFilteringOptions] = useState([] as any);

  const [status, setStatus] = useState('pending');
  const fetchData = async (
    filteringText: string,
    filteringProperty?: { key: any } | undefined
  ) => {
    try {
      const { filteringOptions } = await asyncFetchFilteringOptions({
        filteringText,
        filteringPropertyKey: filteringProperty
          ? filteringProperty.key
          : undefined,
        table: tableName,
      });
      if (
        !request.current ||
        request.current.filteringText !== filteringText ||
        request.current.filteringProperty !== filteringProperty
      ) {
        return;
      }
      setFilteringOptions(filteringOptions);
      setStatus('finished');
    } catch (error) {
      setStatus('error');
    }
  };

  const handleLoadItems = ({ detail }: any) => {
    const { filteringProperty, filteringText, firstPage } = detail;
    setStatus('loading');
    if (firstPage) {
      setFilteringOptions([]);
    }
    request.current = {
      filteringProperty,
      filteringText,
    };
    fetchData(filteringText, filteringProperty);
  };

  useEffect(() => {
    fetchData('');
  }, []);

  return {
    status,
    filteringOptions,
    handleLoadItems,
  };
};
