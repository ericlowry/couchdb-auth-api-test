import useAuth from '../state/useAuth';
import { useHistory } from 'react-router-dom';

const ProfilePage = () => {
  const { logout, profile } = useAuth();
  const history = useHistory();
  return (
    <>
      <h1>Profile Page</h1>
      <pre>{JSON.stringify(profile,null,2)}</pre>
      <button
        onClick={() => {
          logout().then(() => {
            console.log('logged out!');
            history.replace('/');
          });
        }}
      >
        Logout
      </button>
    </>
  );
};

export default ProfilePage;
