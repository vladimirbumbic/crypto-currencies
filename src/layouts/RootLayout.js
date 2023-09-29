import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { login } from '../features/loginSlice';

const RootLayout = () => {
  const { isLoggedIn } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(login());
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <header>
        <div>
          <NavLink to='/' className='navLink'>
            Home
          </NavLink>
          {isLoggedIn && (
            <NavLink
              to='/favorites'
              style={{ marginLeft: '10px' }}
              className='navLink'
            >
              Favorites
            </NavLink>
          )}
        </div>
        {!isLoggedIn && (
          <div style={{ alignSelf: 'flex-end' }}>
            <button onClick={handleLogin} className='login'>
              Login
            </button>
          </div>
        )}
      </header>
      <main style={{ overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
