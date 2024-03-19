import PageWrapper from '@/components/common/PageWrapper';
import SearchInput from '@/components/common/SearchInput';
import { useAppDispatch, useAppSelector } from '@/store';
import { Typography } from '@mui/material';
import { setSearchTerm } from '@/store/slices/cats.slice';
import { useGetTopFiveCatsQuery } from '@/store/http/api/cats';
import CatCardDisplay from '@/components/common/CatCardDisplay';
import { NAV_LINKS } from '@/App';
import { useNavigate } from 'react-router-dom';
type Props = {};

function TopFive({}: Props) {
  const searchTerm = useAppSelector((state) => state.cats.catNameSearchTerm);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: cats, isLoading, error } = useGetTopFiveCatsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error || !cats?.length) return <div>Error loading top cats</div>;

  //a handler for search input

  const handleSearchTerm = (term: string) => {
    dispatch(setSearchTerm(term));
    navigate(`${NAV_LINKS.SEARCH}?search=${encodeURIComponent(term)}`);
  };

  return (
    <PageWrapper>
      <Typography variant="h4">TopFive</Typography>
      <SearchInput emitNewTerm={handleSearchTerm} initialSearchTerm={searchTerm} />
      <CatCardDisplay cats={cats} />
    </PageWrapper>
  );
}

export default TopFive;
