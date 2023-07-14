import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { configureFakeBackend } from './helpers';
import { httpInterceptor } from './helpers/util';

httpInterceptor()
// configureFakeBackend()
const container: HTMLElement = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)