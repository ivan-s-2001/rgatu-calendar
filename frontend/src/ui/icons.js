const paths = {
  home: '<path d="M8 1.5 1.5 7v7.5h4V10h5v4.5h4V7z"/>',
  calendar: '<path d="M2 2.5h12v12H2z"/><path d="M2 6h12M5 1v3M11 1v3"/>',
  grid: '<path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z"/>',
  user: '<circle cx="8" cy="5" r="3"/><path d="M2.5 15c.4-3.3 2.2-5 5.5-5s5.1 1.7 5.5 5"/>',
  users: '<circle cx="6" cy="5" r="2.5"/><path d="M1.5 14c.3-2.8 1.8-4.3 4.5-4.3s4.2 1.5 4.5 4.3"/><path d="M10.5 3.5a2.3 2.3 0 0 1 0 4.2M11.2 9.8c2 .4 3 1.8 3.3 4.2"/>',
  book: '<path d="M2 3.5A2.5 2.5 0 0 1 4.5 1H14v12H4.5A2.5 2.5 0 0 0 2 15z"/><path d="M2 3.5A2.5 2.5 0 0 0 4.5 6H14"/>',
  check: '<path d="m2.5 8 3.2 3.2L13.5 3.5"/>',
  file: '<path d="M3 1.5h6l4 4v9H3z"/><path d="M9 1.5v4h4M5.5 9h5M5.5 12h5"/>',
  chart: '<path d="M2 14V8M6 14V3M10 14V6M14 14V1"/>',
  settings: '<circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M13 3l-1.4 1.4M4.4 11.6 3 13"/>',
  arrow: '<path d="M3 8h10M9 4l4 4-4 4"/>',
  external: '<path d="M9 2h5v5M14 2 7.5 8.5"/><path d="M12 9v5H2V4h5"/>',
  bell: '<path d="M3.5 11.5h9l-1-1.7V6a3.5 3.5 0 0 0-7 0v3.8z"/><path d="M6.5 13.5a1.8 1.8 0 0 0 3 0"/>',
  building: '<path d="M2 14.5V5l6-3 6 3v9.5M5 7h2M9 7h2M5 10h2M9 10h2M7 14.5v-2h2v2"/>',
};

export function icon(name) {
  return `<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.grid}</svg>`;
}
