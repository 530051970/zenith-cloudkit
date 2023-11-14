import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalData: number;
  onPageChange: (curPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = (props: PaginationProps) => {
  const { currentPage, pageSize, totalData, onPageChange } = props;
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalData / pageSize);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <div>
      <nav>
        <ul className="pagination">
          <li className={currentPage === 1 ? 'disabled' : ''}>
            <span
              onClick={() => {
                if (currentPage <= 1) {
                  return;
                }
                onPageChange(currentPage - 1);
              }}
            >
              {t('table.prev')}
            </span>
          </li>
          {pages.map((page) => (
            <li key={page} className={currentPage === page ? 'active' : ''}>
              <span onClick={() => onPageChange(page)}>{page}</span>
            </li>
          ))}
          <li className={currentPage === totalPages ? 'disabled' : ''}>
            <span
              onClick={() => {
                if (currentPage >= totalPages) {
                  return;
                }
                onPageChange(currentPage + 1);
              }}
            >
              {t('table.next')}
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
