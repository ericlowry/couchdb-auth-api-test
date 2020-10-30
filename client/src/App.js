import './App.css';

import useAuth from './state/useAuth';
import { Switch, Route, Link } from 'react-router-dom';

import LandingPage from './content/LandingPage';
import HomePage from './content/HomePage';
import LoginPage from './content/LoginPage';
import ProfilePage from './content/ProfilePage';
import WidgetsPage from './content/WidgetsPage';
import WidgetPage from './content/widget/WidgetPage';

import NotFoundPage from './content/NotFoundPage';

function App() {
  const { loading, profile } = useAuth();

  if (loading) return <>Loading...</>;

  return (
    <>
      <>
        <Link to="/"> Home </Link>

        {profile.name && (
          <>
            &nbsp; <Link to="/profile"> Profile </Link>
            &nbsp; <Link to="/widgets"> Widgets </Link>
          </>
        )}
      </>

      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/widgets" component={WidgetsPage} />
        <Route path="/widget/:id" component={WidgetPage} />

        <Route
          path="/"
          exact
          component={profile.name ? HomePage : LandingPage}
        />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </>
  );
}

export default App;
