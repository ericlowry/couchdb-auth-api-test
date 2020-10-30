import useAuth from '../state/useAuth';

const HomePage = () => {
  const { profile } = useAuth();
  return (
    <>
      <h1>Welcome {profile.label}!</h1>
    </>
  );
};

export default HomePage;
