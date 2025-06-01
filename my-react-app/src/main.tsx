import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AccountContext, IAccountInfo } from './context/AccountContext';
import { useState } from 'react';
import RootLayout from './app/layout';

function Root() {
  const [accountInfo, setAccountInfo] = useState<IAccountInfo | undefined>();

  const handleSetAccountInfo = (value: IAccountInfo) => {
    setAccountInfo(value);
    localStorage.setItem("_jwt", value.jwt!);
    localStorage.setItem("_refreshToken", value.refreshToken!);
  }

  return (
    <AccountContext.Provider value={{
      accountInfo: accountInfo,
      setAccountInfo: handleSetAccountInfo,
    }}>
      <BrowserRouter>
        <RootLayout>
          <App />
        </RootLayout>
      </BrowserRouter>
    </AccountContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
