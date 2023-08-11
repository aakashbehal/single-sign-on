import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { configureFakeBackend } from './helpers';
import { httpInterceptor } from './helpers/util';
import reportWebVitals from './reportWebVitals';
import { Metric } from 'web-vitals';

function reportHandler(metric: Metric) {
    // console.log(metric);
}

httpInterceptor()
// configureFakeBackend()
const container: HTMLElement = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(reportHandler);
