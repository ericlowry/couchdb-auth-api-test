import useAuth from '../state/useAuth';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const history = useHistory();
  return (
    <>
      <h1>Login Page</h1>
      <button
        onClick={() => {
          login('eric', 'xxx')
            .then(() => {
              console.log('logged in!');
              history.replace('/');
            })
            .catch(() => {
              console.log('login failed');
            });
        }}
      >
        Login
      </button>
    </>
  );
};

export default LoginPage;
