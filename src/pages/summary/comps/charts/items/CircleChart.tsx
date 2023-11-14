import { Header, Spinner } from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';
import {
  getCatalogSummaryByModifier,
  getCatalogSummaryByPrivacy,
} from 'apis/dashboard/api';
import CommonPieChart from './CommonPieChart';
import {
  IModifierChartType,
  IPieChartDataType,
  IPrivacyPieChartType,
} from 'ts/dashboard/types';

interface CircleChartType {
  title: string;
  sourceType: 's3' | 'rds';
  circleType: 'pie' | 'donut' | undefined;
}

const COLOR_CONFIG: any = {
  '-1': '#8D99A8',
  '0': '#89BDEE',
  '1': '#EB6F6F',
};

const CircleChart: React.FC<CircleChartType> = (props: CircleChartType) => {
  const { title, sourceType, circleType } = props;
  const [loadingPrivacy, setLoadingPrivacy] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [privacyDataList, setPrivacyDataList] = useState<IPieChartDataType[]>(
    []
  );
  const [sourceTotal, setSourceTotal] = useState(0);

  const [modifierDataList, setModifierDataList] = useState<IPieChartDataType[]>(
    []
  );

  const getPrivacyDataCatalog = async () => {
    setLoadingPrivacy(true);
    const res = (await getCatalogSummaryByPrivacy({
      database_type: sourceType,
    })) as IPrivacyPieChartType[];
    const tmpDataList: IPieChartDataType[] = [];
    if (res && res.length > 0) {
      res.forEach((element) => {
        tmpDataList.push({
          title:
            element.privacy === 0
              ? 'Non-PII'
              : element.privacy === 1
              ? 'Contains PII'
              : 'N/A',
          value:
            sourceType === 's3'
              ? element.database_total
              : element.instance_total,
          color: COLOR_CONFIG[element.privacy],
        });
      });
      const total = res.reduce((accumulator: number, item) => {
        return (
          accumulator +
          (sourceType === 's3' ? item.database_total : item.instance_total)
        );
      }, 0);
      setSourceTotal(total);
    }
    setPrivacyDataList(tmpDataList);
    setLoadingPrivacy(false);
  };

  const getLastUpdateDataCatalog = async () => {
    setLoadingStatus(true);
    const res = (await getCatalogSummaryByModifier({
      database_type: sourceType,
    })) as IModifierChartType[];
    const tmpDataList: IPieChartDataType[] = [];
    if (res && res.length > 0) {
      res.forEach((element) => {
        tmpDataList.push({
          title: element.modifier,
          value: element.data_sources,
          color: element.modifier === 'Manual' ? '#9469D6' : '#8D99A8',
        });
      });
    }
    setModifierDataList(tmpDataList);
    setLoadingStatus(false);
  };

  useEffect(() => {
    if (circleType === 'donut') {
      getPrivacyDataCatalog();
    }
    if (circleType === 'pie') {
      getLastUpdateDataCatalog();
    }
  }, [circleType]);

  return (
    <div>
      <Header variant="h3">{title}</Header>
      {circleType === 'donut' &&
        (loadingPrivacy ? (
          <Spinner />
        ) : (
          <CommonPieChart
            sourceType={sourceType}
            chartData={privacyDataList}
            circleType="donut"
            sourceTotal={sourceTotal}
          />
        ))}
      {circleType === 'pie' &&
        (loadingStatus ? (
          <Spinner />
        ) : (
          <CommonPieChart
            sourceType={sourceType}
            circleType="pie"
            chartData={modifierDataList}
          />
        ))}
    </div>
  );
};

export default CircleChart;
