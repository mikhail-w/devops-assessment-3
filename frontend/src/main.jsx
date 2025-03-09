import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <BrowserRouter basename="/pokedex">
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="random/:randomID?" element={<RandPokemonPage />} />
          <Route path="pokemon/:name" element={<PokemonPage />} />
          <Route path="team" element={<MyTeamPage />} />
          <Route path="list" element={<PokemonListPage />} />
          <Route path="flip" element={<PokeFlipPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);
