/*
 * @Author: your name
 * @Date: 2020-06-23 14:59:48
 * @LastEditTime: 2020-07-29 19:50:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \CITZ-IMB-Capstone2020 - xordpe-dev\src\views\App.js
 */ 
import React, {useState} from 'react';
import Header from './Header.js';
import Footer from './Footer.js';
import FetchLatestNews from './FetchLatestNews.js';
import FavoriteNews from './FavoriteNews.js';
import 'bootstrap/dist/css/bootstrap.min.css';
// add .Dark mode
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "./GlobalStyles.js";
import { lightTheme, darkTheme } from "./Themes.js";
import { UseDarkMode } from "./UseDarkMode.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import { useSelector } from 'react-redux';
import { SW_INIT, SW_UPDATE } from './types.js';
import Alert from './Alert.js';
import '../css/App-alert.css'
import About from './About.js';


function App() {

  const [theme, themeToggler, mountedComponent] = UseDarkMode();
  //check out the current theme is dark mode or not
  const themeMode = theme === 'Dark' ? lightTheme : darkTheme;
  const [deleted, setDeleted] = useState(false);
  const [showText, setShowText] = useState(false);
  const [newsType, setNewsType] = useState("releases");

  //call back functions from line 39 - line 61 for update notifivation, order is really important!!!!!!!!!
  const isServiceWorkerInitialized = useSelector(
    state => state.serviceWorkerInitialized,
  );
  const isServiceWorkerUpdated = useSelector(
    state => state.serviceWorkerUpdated,
  );
  const serviceWorkerRegistration = useSelector(
    state => state.serviceWorkerRegistration,
  );

  //call when there is a new version of serviceworker generated
  const updateServiceWorker = () => {
    const registrationWaiting = serviceWorkerRegistration.waiting;

    if (registrationWaiting) {
     registrationWaiting.postMessage({ type: 'SKIP_WAITING' });

      registrationWaiting.addEventListener('statechange', e => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  // functions sent to Header.js to access state variables
  const updateFavorites = () => {
    setDeleted(!deleted);
  }

  const textSwitch = () => {
    setShowText(!showText);
  }

  const updateNewsType = (type) => {
    setNewsType(type);
  }

  //The highlighted code is the only one added to UseDarkMode.js
  if(!mountedComponent) return <div/>
  
  const handleDarkMode = () => {
    //this is the key function to switch the mode
    themeToggler();
  };



  return (
    <div>
      <ThemeProvider theme={themeMode}>
      <>
      <GlobalStyles/>
        <Router>
          <Header updateFavorites={updateFavorites} onDarkMode={handleDarkMode} theme={theme} textSwitch={textSwitch} showText={showText} updateNewsType={updateNewsType}/>
          
          <div className="App-alert">
            {isServiceWorkerInitialized && (
              <Alert text="Service Worker is initialized for the first time." type={SW_INIT} />
            )}
            {isServiceWorkerUpdated && (
              <Alert
                text="There is a new version available."
                buttonText="Update"
                type={SW_UPDATE}
                onClick={updateServiceWorker}
              />
            )}
          </div>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            
            <Route path="/favorites">
              <FavoriteNews deleted={deleted} showText={showText} theme={theme}/>
            </Route>

            <Route path="/">
              <FetchLatestNews showText={showText} newsType={newsType} theme={theme}/>
            </Route>
          </Switch>
          <br/><br/><br/><br/><br/><br/><br/>
          <Footer />
        
        </Router>
      </>
      </ThemeProvider>

      {/* cookie notification */}
      <CookieConsent
          onAccept={() => {
            //alert("accepted!");
          }}
          //debug={true}
        >
          This website uses cookies to enhance the user experience.{" "}
        </CookieConsent>

    </div>
  );
}

export default App;

