// src/components/SnackbarManager.js
// import { useEffect } from 'react';
// import { Snackbar } from '@mui/material';
// import { removeSnackbar } from '@/store/slices/snackbar.slice';
// import { useAppDispatch, useAppSelector } from '@/store';

const SnackbarManager = () => {
  // const dispatch = useAppDispatch();
  // const snackbars = useAppSelector((state) => state.snackbar.snackbars);

  // useEffect(() => {
  //   snackbars.forEach((snackbar) => {
  //     setTimeout(() => {
  //       dispatch(removeSnackbar(snackbar.id));
  //     }, 3000);
  //   });
  // }, [snackbars, dispatch]);

  return (
    <>
      {/* {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          open={true}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        />
      ))} */}
    </>
  );
};

export default SnackbarManager;
