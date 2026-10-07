import './design-system/tokens.css';
import './design-system/foundation.css';
import './design-system/components.css';
import './app.css';
import './role-shell.css';
import './navigation.css';
import { api } from './api.js';

window.rgatuApi = api;
window.rgatuConfig = Object.freeze({
  apiBaseUrl: api.baseUrl,
});

import('./app.js');
