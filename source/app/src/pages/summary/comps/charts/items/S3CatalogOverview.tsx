import {
  Box,
  ColumnLayout,
  Grid,
  Spinner,
} from '@cloudscape-design/components';
import { getDataCatalogSummary } from 'apis/dashboard/api';
import { CounterLink } from 'common/component/ConterLink';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumber, formatSize } from 'tools/tools';
import { ColumnChartData, ICatalogSummary } from 'ts/dashboard/types';
import HorizontalBarChart from './HorizontalBarChart';

const S3CatalogOverview = () => {
  const [loadingData, setLoadingData] = useState(true);
  const { t } = useTranslation();
  const [catalogSummaryData, setCatalogSummaryData] =
    useState<ICatalogSummary>();
  const [columChartData, setColumChartData] = useState<ColumnChartData[]>([]);

  const getS3DatacatalogSummary = async () => {
    try {
      const res = await getDataCatalogSummary({
        database_type: 's3',
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
    } catch (error) {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    getS3DatacatalogSummary();
  }, []);

  return (
    <Grid
      gridDefinition={
        loadingData ? [{ colspan: 12 }] : [{ colspan: 7 }, { colspan: 5 }]
      }
    >
      {loadingData ? (
        <Spinner />
      ) : (
        <>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="awsui-key-label">{t('summary:s3Bucket')}</Box>
              <CounterLink>
                {formatNumber(catalogSummaryData?.database_total || 0)}
              </CounterLink>
            </div>
            <div>
              <Box variant="awsui-key-label">{t('summary:s3Objects')}</Box>
              <CounterLink>
                {formatNumber(catalogSummaryData?.object_total || 0)}
              </CounterLink>
            </div>
            <div>
              <Box variant="awsui-key-label">{t('summary:s3ObjectSize')}</Box>
              <CounterLink>
                {formatSize(catalogSummaryData?.size_total || 0)}
              </CounterLink>
            </div>
          </ColumnLayout>
          <div>
            <Box variant="awsui-key-label">{t('summary:objectTypes')}</Box>
            <HorizontalBarChart chartData={columChartData} />
          </div>
        </>
      )}
    </Grid>
  );
};

export default S3CatalogOverview;
