import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import type { ILoginParams } from '@/types/index';
import { Role } from '@/types/index';
import PageWrapper from '@/components/common/PageWrapper';
import { useSnackbar } from 'notistack';
import { useAdminLoginMutation, useUserLoginMutation } from '@/store/http/api/auth';
import { NAV_LINKS } from '@/App';
import { useNavigate } from 'react-router-dom';

const LoginUser = () => {
  const [userLogin, { isLoading: isUserLoading }] = useUserLoginMutation();
  const [adminLogin, { isLoading: isAdminLoading }] = useAdminLoginMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginParams & { role: Role }>();

  const onSubmit: SubmitHandler<ILoginParams & { role: Role }> = async ({ role, password, username }) => {
    try {
      const loginResult =
        role === Role.ADMIN
          ? await adminLogin({ password, username }).unwrap()
          : await userLogin({ password, username }).unwrap();
      console.log('🚀 ~ constonSubmit:SubmitHandler<ILoginParams&{role:Role}>= ~ loginResult:', loginResult);
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate(NAV_LINKS.HOME);
    } catch (err) {
      console.error('Login error:', err);
      enqueueSnackbar(`Login failed! Please try again.`, { variant: 'error' });
    }
  };

  return (
    <PageWrapper>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={8} component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          {/* USERNAME */}
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            {...register('username', { required: 'Username is required' })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          {/* PASSWORD */}
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
          {/* SELECT ROLE TO LOGIN AS */}
          <RadioGroup row defaultValue={Role.USER} name="role" sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <FormControlLabel value={Role.USER} control={<Radio />} label="User" {...register('role')} />
            <FormControlLabel value={Role.ADMIN} control={<Radio />} label="Administrator" {...register('role')} />
          </RadioGroup>
          {/* SUBMIT FORM BUTTON */}
          <Button fullWidth type="submit" variant="contained" disabled={isUserLoading || isAdminLoading} sx={{ mt: 3 }}>
            {isUserLoading || isAdminLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default LoginUser;
