import {
  Button,
  Grid,
  Header,
  SpaceBetween,
  Spinner,
} from '@cloudscape-design/components';
import React, { memo, useEffect, useState } from 'react';
import S3CatalogOverview from './items/S3CatalogOverview';
import MapChart from './items/MapChart';
import CircleChart from './items/CircleChart';
import TableData from './items/TableData';
import { getCatalogTopNData } from 'apis/dashboard/api';
import { ITableDataType, ITableListKeyValue } from 'ts/dashboard/types';
import { useNavigate } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
import Pagination from './items/Pagination';
import { useTranslation } from 'react-i18next';
import IdentifierTableData from './items/IdentifierTable';
import { Props } from 'common/PropsModal';

const Links: React.FC<any> = memo(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loadingTableData, setLoadingTableData] = useState(true);

  const [currentPagePII, setCurrentPagePII] = useState(1);
  const [pageSizePII] = useState(5);
  const [allConatainsPIIDataData, setAllConatainsPIIDataData] = useState<
    ITableListKeyValue[]
  >([]);
  const handlePageChangePII = (page: number) => {
    setCurrentPagePII(page);
  };

  const [allIdentifierData, setAllIdentifierData] = useState<
    ITableListKeyValue[]
  >([]);

  const getTopNTableData = async () => {
    setLoadingTableData(true);
    try {
      const tableData = (await getCatalogTopNData({
        database_type: 's3',
        top_n: 99999,
      })) as ITableDataType;
      setAllConatainsPIIDataData(tableData.account_top_n);
      if (tableData.identifier_top_n && tableData.identifier_top_n.length > 0) {
        tableData.identifier_top_n.forEach((element) => {
          element.category =
            element?.props?.find(
              (prop: Props) => prop.prop_type?.toString() === '1'
            )?.prop_name || 'N/A';
          element.identifierLabel =
            element?.props?.find(
              (prop: Props) => prop.prop_type?.toString() === '2'
            )?.prop_name || 'N/A';
        });
      }
      setAllIdentifierData(tableData.identifier_top_n);
      setLoadingTableData(false);
    } catch (error) {
      setLoadingTableData(false);
    }
  };

  useEffect(() => {
    getTopNTableData();
  }, []);

  return (
    <div style={{height:500}}>
      
    </div>
  );
});

export default Links;
