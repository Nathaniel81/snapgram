import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import { Toaster } from './components/ui/toaster.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <Toaster />
      <App />
    </Provider>
)
