import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/Login';
import MoviePage from './components/Movie'; 
import ProtectedRoute from './components/ProtectedRoute';  
import Fav from './components/Fav';
import Search from './components/Search';
import Music from './components/Music';
import Cpassword from './components/Cpassword';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Favorites" element={<Fav />} />
        <Route path="/Music" element={<Music />} />
        <Route path="/change-password" element={<Cpassword />} />

        <Route
          path="/movie"
          element={
            <ProtectedRoute>
              <MoviePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);