import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Header,
  ColumnLayout,
  Grid,
  Spinner,
} from '@cloudscape-design/components';
import { CounterLink } from '../../../common/ConterLink';
import { getAccountInformation } from 'apis/dashboard/api';
import { IAccountInfo, ISourceCoverage } from 'ts/dashboard/types';
import { getSourceCoverage } from 'apis/data-source/api-mock';
import { useTranslation } from 'react-i18next';

const Overview: React.FC = () => {
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingCoverage, setLoadingCoverage] = useState(true);
  const [accountInfo, setAccountInfo] = useState<IAccountInfo>();
  const [coverageInfo, setCoverageInfo] = useState<ISourceCoverage>();
  const { t } = useTranslation();
  const getOverviewData = async () => {
    setLoadingOverview(true);
    const res = await getAccountInformation();
    setAccountInfo(res as IAccountInfo);
    setLoadingOverview(false);
  };

  const getDashbaordSourceCoverage = async () => {
    setLoadingCoverage(true);
    try {
      const res = await getSourceCoverage();
      setCoverageInfo(res as ISourceCoverage);
      setLoadingCoverage(false);
    } catch (error) {
      setLoadingCoverage(false);
    }
  };

  useEffect(() => {
    getOverviewData();
    getDashbaordSourceCoverage();
  }, []);

  return (
    <Grid gridDefinition={[{ colspan: 5 }, { colspan: 7 }]}>
      <div>
        <Container
          header={
            <Header variant="h2" description={t('summary:customResourcesDesc')}>
              {t('summary:customResources')}
            </Header>
          }
        >
          {loadingOverview ? (
            <Spinner />
          ) : (
            <ColumnLayout columns={2} variant="text-grid">
              <div>
                <Box variant="awsui-key-label">
                  {t('summary:totalDB')}
                </Box>
                <CounterLink>{accountInfo?.account_total}</CounterLink>
              </div>
              <div>
                <Box variant="awsui-key-label">{t('summary:totalOOS')}</Box>
                <CounterLink>{accountInfo?.region_total}</CounterLink>
              </div>
            </ColumnLayout>
          )}
        </Container>
      </div>
      <div>
        <Container
          header={
            <Header
              variant="h2"
              description={t('summary:cloudResourcesDesc')}
            >
              {t('summary:cloudResources')}
            </Header>
          }
        >
          {loadingCoverage ? (
            <Spinner />
          ) : (
            <ColumnLayout columns={2} variant="text-grid">
              <div>
                <Box variant="awsui-key-label">
                  {t('summary:totalDB')}
                </Box>
                <CounterLink>{coverageInfo?.s3_total}</CounterLink>
              </div>
              <div>
                <Box variant="awsui-key-label">
                  {t('summary:totalOOS')}
                </Box>
                <CounterLink>{coverageInfo?.rds_total}</CounterLink>
              </div>
            </ColumnLayout>
          )}
        </Container>
      </div>
    </Grid>
  );
};

export default Overview;
