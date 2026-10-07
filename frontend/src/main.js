import './design-system/tokens.css';
import './design-system/foundation.css';
import './design-system/components.css';
import './app.css';
import './surface-shell.css';
import './navigation.css';
import { api } from './api.js';
import { resolveSurface, SURFACE_META } from './core/surface.js';

const surface = resolveSurface();
const meta = SURFACE_META[surface];

document.documentElement.dataset.surface = surface;
document.body.dataset.role = surface;
document.title = `РГАТУ · ${meta.title}`;

window.rgatuApi = api;
window.rgatuConfig = Object.freeze({
  apiBaseUrl: api.baseUrl,
  surface,
  domain: meta.domain,
});

import('./app.js');
