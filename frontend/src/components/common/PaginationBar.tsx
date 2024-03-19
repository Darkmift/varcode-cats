import React from 'react';
import { IPaginationResult } from '@/types';
import { Box, Button } from '@mui/material';

type PaginationBarProps = {
  paginationData: IPaginationResult<any>;
  onPageChange: (page: number) => void;
  currentPage: number;
};

const PaginationBar: React.FC<PaginationBarProps> = ({ paginationData, onPageChange, currentPage }) => {
  const { total, items } = paginationData;
  const pageCount = Math.ceil(total / items.length);

  // Determine the range of page numbers to show
  const firstPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
  const lastPage = firstPage + 4 <= pageCount ? firstPage + 4 : pageCount;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px', p: '16px' }}>
      <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Prev
      </Button>
      {[...Array(lastPage - firstPage + 1)].map((_, index) => {
        const pageNumber = firstPage + index;
        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? 'contained' : 'text'}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      })}
      <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount}>
        Next
      </Button>
    </Box>
  );
};

export default PaginationBar;
