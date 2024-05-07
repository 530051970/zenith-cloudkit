import {
  Box,
  ColumnLayout,
  Grid,
  Spinner,
} from '@cloudscape-design/components';
import React, { useEffect, useState } from 'react';
import { CounterLink } from 'common/ConterLink';
import HorizontalBarChart from './HorizontalBarChart';
import { getDataCatalogSummary } from 'apis/dashboard/api';
import { ICatalogSummary, ColumnChartData } from 'ts/dashboard/types';
import { formatNumber } from 'tools/tools';
import { useTranslation } from 'react-i18next';

const RDSCatalogOverview = () => {
  const [loadingData, setLoadingData] = useState(true);
  const { t } = useTranslation();
  const [catalogSummaryData, setCatalogSummaryData] =
    useState<ICatalogSummary>();
  const [columChartData, setColumChartData] = useState<ColumnChartData[]>([]);

  const getS3DatacatalogSummary = async () => {
    const res = await getDataCatalogSummary({
      database_type: 'rds',
    });
    setCatalogSummaryData(res as ICatalogSummary);
    const tmpData = res as ICatalogSummary;
    const tmpColumnChartData: ColumnChartData[] = [];
    tmpData.column_chart.forEach((element) => {
      element.total_count = tmpData.column_chart.reduce(
        (accumulator: number, item: any) => {
          return accumulator + item.table_total;
        },
        0
      );
      tmpColumnChartData.push({
        title: element.classification,
        type: 'bar',
        valueFormatter: (e: any) => `${(100 * e).toFixed(0)}%`,
        data: [{ x: '', y: element.table_total / element.total_count }],
      });
    });
    setColumChartData(tmpColumnChartData);
    setLoadingData(false);
  };

  useEffect(() => {
    getS3DatacatalogSummary();
  }, []);

  return (
    <>
      {loadingData ? (
        <Spinner />
      ) : (
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          <ColumnLayout columns={4} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">{t('summary:rdsIntacnes')}</Box>
              <CounterLink>
                {formatNumber(catalogSummaryData?.instance_total || 0)}
              </CounterLink>
            </div>
            <div>
              <Box variant="awsui-key-label">{t('summary:rdsTables')}</Box>
              <CounterLink>
                {formatNumber(catalogSummaryData?.table_total || 0)}
              </CounterLink>
            </div>
            <div>
              <Box variant="awsui-key-label">{t('summary:rdsColumns')}</Box>
              <CounterLink>
                {formatNumber(catalogSummaryData?.column_total || 0)}
              </CounterLink>
            </div>
          </ColumnLayout>
          <div>
            <Box variant="awsui-key-label">{t('summary:rdsEngineTypes')}</Box>
            <HorizontalBarChart chartData={columChartData} />
          </div>
        </Grid>
      )}
    </>
  );
};

export default RDSCatalogOverview;
