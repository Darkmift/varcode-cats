import PageWrapper from '@/components/common/PageWrapper';
import SearchInput from '@/components/common/SearchInput';
import { useAppDispatch, useAppSelector } from '@/store';
import { Typography } from '@mui/material';
import { setSearchTerm } from '@/store/slices/cats.slice';
type Props = {};

function TopFive({}: Props) {
  const searchTerm = useAppSelector((state) => state.cats.catNameSearchTerm);
  const dispatch = useAppDispatch();

  //a handler for search input

  const handleSearchTerm = (term: string) => {
    console.log('🚀 ~ handleSearchTerm ~ term:', term);
    dispatch(setSearchTerm(term));
  };

  return (
    <PageWrapper>
      <Typography variant="h4">TopFive</Typography>
      <SearchInput emitNewTerm={handleSearchTerm} initialSearchTerm={searchTerm} />
    </PageWrapper>
  );
}

export default TopFive;
