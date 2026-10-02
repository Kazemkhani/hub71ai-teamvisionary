// FROZEN. Routing without a router: "/" is the pitch site (pack C), "/app" is the product (pack B).
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Pitch from './pitch/Pitch';
import './index.css';

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const Root = path.startsWith('/app') ? App : Pitch;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
