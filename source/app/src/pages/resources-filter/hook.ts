import { getPropertyValues } from 'apis/query/api';
import { useEffect, useRef, useState } from 'react';
// import { TABLE_NAME } from 'enum/common_types';

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
