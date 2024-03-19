// takes in an array of ICat and renders CatCard components for each cat

import { ICat } from '@/types';
import { Grid } from '@mui/material';
import CatCard from './CatCard';

type CatCardDisplayProps = {
  cats: ICat[];
};

const CatCardDisplay = ({ cats }: CatCardDisplayProps) => {
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', // This centers the cards in the row
        flexWrap: 'wrap', // This allows cards to wrap to the next line
      }}
    >
      {cats?.map((cat) => (
        <CatCard cat={cat} key={cat.id} />
      ))}
    </Grid>
  );
};

export default CatCardDisplay;
