import React from 'react';
import { PieChart } from '@cloudscape-design/components';
import { IPieChartDataType } from 'ts/dashboard/types';
import { useTranslation } from 'react-i18next';

interface CommonPieChartProps {
  sourceType: 's3' | 'rds';
  circleType: 'pie' | 'donut' | undefined;
  chartData: IPieChartDataType[];
  sourceTotal?: number;
}

export const percentageFormatter = (value: any) =>
  `${(value * 100).toFixed(0)}%`;

const CommonPieChart: React.FC<CommonPieChartProps> = (
  props: CommonPieChartProps
) => {
  const { sourceType, sourceTotal, circleType, chartData } = props;
  const { t } = useTranslation();
  return (
    <PieChart
      variant={circleType}
      size="medium"
      innerMetricDescription={
        (sourceType === 's3' ? t('summary:buckets') : t('summary:instances')) ||
        ''
      }
      innerMetricValue={sourceTotal?.toString()}
      data={chartData}
      hideFilter={true}
      segmentDescription={(datum, sum) =>
        `${datum.value} ${
          sourceType === 's3'
            ? t('summary:s3Buckets')
            : t('summary:rdsInstances')
        }, ${percentageFormatter(datum.value / sum)}`
      }
      detailPopoverContent={(datum, sum) => [
        {
          key:
            sourceType === 's3'
              ? t('summary:s3Buckets')
              : t('summary:rdsInstances'),
          value: datum.value,
        },
        {
          key: 'Percentage',
          value: percentageFormatter(datum.value / sum),
        },
      ]}
    />
  );
};

export default CommonPieChart;
