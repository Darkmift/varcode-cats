import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Grid } from '@mui/material';
import { ILoginParams } from '../../../backend/src/auth/auth.types';
import PageWrapper from '@/components/common/PageWrapper';
import { useSnackbar } from 'notistack';
import { useUserLoginMutation } from '@/store/http/api/auth';
import { NAV_LINKS } from '@/App';
import { useNavigate } from 'react-router-dom';
// import { triggerSnackbar } from '@/store/slices/snackbar.slice';

const LoginUser = () => {
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginParams>();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit: SubmitHandler<ILoginParams> = async (data) => {
    try {
      await userLogin(data).unwrap();
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate(NAV_LINKS.HOME);
    } catch (err) {
      console.error('Login error:', err);
      enqueueSnackbar(`Login failed! Please try again. ${JSON.stringify({ error: err }, null, 2)}`, {
        variant: 'error',
      });
    }
  };

  return (
    <PageWrapper>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={8} component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            {...register('username', { required: 'Username is required' })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading} // Disable button while loading
            sx={{ mt: 3 }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default LoginUser;
