import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import ResizeObserver from "resize-observer-polyfill"

window.ResizeObserver = ResizeObserver;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App/>
);
