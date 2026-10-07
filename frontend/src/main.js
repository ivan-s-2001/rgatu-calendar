import './app.css';
import { api } from './api.js';

window.rgatuApi = api;
window.rgatuConfig = Object.freeze({
  apiBaseUrl: api.baseUrl,
});

import('./app.js');
