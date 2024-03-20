import CatCardDisplay from '@/components/common/CatCardDisplay';
import PageWrapper from '@/components/common/PageWrapper';
import PaginationBar from '@/components/common/PaginationBar';
import { useSearchCatsQuery } from '@/store/http/api/cats';
import { Chip, Grid, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';

type Props = {};

function SearchResults({}: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data: cats, isLoading, error } = useSearchCatsQuery({ search: searchTerm, page, limit: 10 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading search results</div>;

  const handlePageChange = (newPage: number) => {
    // Update the URL with the new page
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    navigate(`?${newSearchParams.toString()}`, { replace: true });
    // Perform any additional actions like refetching data
  };

  return (
    <PageWrapper>
      <Grid item xs={12} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="h4">Search Results</Typography>
        <Chip
          icon={<StarIcon />}
          label={cats?.total?.toLocaleString() || 'N/A'}
          color="primary"
        />
      </Grid>
      <Grid item xs={12}>
        {/* Here you can render the search results */}

        {cats?.items?.length ? (
          <>
            <PaginationBar paginationData={cats} onPageChange={handlePageChange} currentPage={page} />
            <CatCardDisplay cats={cats?.items} />
            <PaginationBar paginationData={cats} onPageChange={handlePageChange} currentPage={page} />
          </>
        ) : (
          <Typography variant="h5">No cats matching query</Typography>
        )}
      </Grid>
    </PageWrapper>
  );
}

export default SearchResults;
