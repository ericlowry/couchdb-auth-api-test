//
// useAuth() - Authentication and Authorization state handler
//

import React, { createContext, useState, useEffect, useContext } from 'react';

const Ctx = createContext();

const noProfile = { roles: [] };
const noSessionData = {};

localStorage.setItem('accessToken', '');

//
// Provider
//
export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(noProfile);
  const [sessionData, setSessionData] = useState(noSessionData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/auth/profile')
      .then(res => {
        if (!res.ok) throw new Error('no-session-found');
        return res.json();
      })
      .then(_data => {
        console.log(_data);
        const { token, profile, data } = _data;
        localStorage.setItem('accessToken', token);
        setProfile(profile);
        setSessionData(data);
      })
      .catch(err => {
        if (err.message === 'no-session-found') {
          // do nothing...
          console.log('no session, no profile...');
        } else {
          // unexpected error...
          console.error(err);
        }
      })
      .then(() => {
        // finally!
        setLoading(false);
      });
  }, []);

  //
  // login(name,password[,data])
  //
  async function login(name, password, data = {}) {
    console.log('...');
    return fetch('/auth/local/login', {
      method: 'post',
      body: JSON.stringify({ name, password, data }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('login failed');
        return res.json();
      })
      .then(data => {
        console.log(data);
        const { token, profile } = data;
        setProfile(profile);
        localStorage.setItem('accessToken', token);
      });
  }

  //
  // logout()
  //
  async function logout() {
    setLoading(true);
    return fetch('/auth/logout', { method: 'post' })
      .then(res => {
        if (!res.ok) console.warn('unable to logout');
      })
      .catch(err => {
        console.warn(err); // unexpected error...
      })
      .finally(() => {
        localStorage.setItem('accessToken', '');
        setProfile(noProfile);
        setSessionData(noSessionData);
        setLoading(false);
      });
  }

  //
  // hasRole() - convenience function for authorization lookup
  //
  // usage:
  //
  //   const { hasRole } = useAuth();
  //   if (hasRole('ADMIN')) {
  //     console.log('you are an administrator...');
  //   }
  //
  const hasRole = (roleOrRoles, successValue = true, failValue = null) => {
    if (typeof roleOrRoles === 'string') {
      // we got a single role
      if (profile.roles.includes(roleOrRoles)) {
        return successValue;
      }
    } else {
      // got got an array of acceptable roles
      if (profile.roles.find(role => roleOrRoles.includes(role))) {
        return successValue;
      }
    }
    // role wasn't found
    return failValue;
  };

  return (
    <Ctx.Provider
      value={{
        profile,
        sessionData,
        loading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

//
// Consumer
//
const useAuth = () => {
  return useContext(Ctx);
};

export default useAuth;
