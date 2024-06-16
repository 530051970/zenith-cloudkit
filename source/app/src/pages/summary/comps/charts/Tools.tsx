import React, { memo, useEffect, useState } from 'react';
// import CustomLineChart from './items/CustomLineChart';
import { getCatalogTopNData } from 'apis/dashboard/api';
import { Props } from 'common/component/PropsModal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ITableDataType, ITableListKeyValue } from 'ts/dashboard/types';

export const Tools: React.FC<any> = memo(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loadingTableData, setLoadingTableData] = useState(true);
  const [conatainsPIIData, setConatainsPIIData] = useState<
    ITableListKeyValue[]
  >([]);
  const [identifierData, setIdentifierData] = useState<ITableListKeyValue[]>(
    []
  );

  const getTopNTableData = async () => {
    setLoadingTableData(true);
    try {
      const tableData = (await getCatalogTopNData({
        database_type: 'rds',
        top_n: 99999,
      })) as ITableDataType;
      setConatainsPIIData(tableData.account_top_n);
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
      setIdentifierData(tableData.identifier_top_n);
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
      <img src="../../imgs/tbd.png" alt='tbd' style={{width:350,marginTop:50,marginLeft:'30%'}}/>
    </div>
  );
});
