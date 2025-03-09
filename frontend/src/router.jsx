import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import RandPokemonPage from './pages/RandPokemonPage.jsx';
import PokemonPage from './pages/PokemonPage.jsx';
import MyTeamPage from './pages/MyTeamPage.jsx';
import PokemonListPage from './pages/PokemonListPage.jsx';
import PokeFlipPage from './pages/PokeFlipPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'random/:randomID?',
          element: <RandPokemonPage />,
        },
        {
          path: 'pokemon/:name',
          element: <PokemonPage />,
        },
        {
          path: 'team',
          element: <MyTeamPage />,
        },
        {
          path: 'list',
          element: <PokemonListPage />,
        },
        {
          path: 'flip',
          element: <PokeFlipPage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'signup',
          element: <SignUpPage />,
        },
        {
          path: 'profile',
          element: <ProfilePage />,
        },
      ],
      errorElement: <NotFoundPage />,
    },
  ],
  {
    basename: '/pokedex',
  }
);

export default router;
