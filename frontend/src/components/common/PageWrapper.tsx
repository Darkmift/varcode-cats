import { Grid } from '@mui/material';
import React from 'react';

const PageWrapper: React.FC<{ children: React.ReactNode; [x: string]: any }> = ({ children, rest }) => {
  return (
    <Grid container {...rest}>
      <Grid item container xs={12}>
        {children}
      </Grid>
    </Grid>
  );
};

export default PageWrapper;
