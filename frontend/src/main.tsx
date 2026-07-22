import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
import './index.css'

if (!navigator.userAgent.includes("Mac")) {
  const style=document.createElement('style');
  style.appendChild(document.createTextNode('*::-webkit-scrollbar {\n' +
      '    width: 8px;\n' +
      '  }\n' +
      '  *::-webkit-scrollbar-track {\n' +
      '    background: white;\n' +
      '  }\n' +
      '  *::-webkit-scrollbar-thumb {\n' +
      '    background-color: theme(\'colors.lightGrey\');\n' +
      '    border-radius: 20px;\n' +
      '  }'));
  document.getElementsByTagName('head')[0].appendChild(style);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
