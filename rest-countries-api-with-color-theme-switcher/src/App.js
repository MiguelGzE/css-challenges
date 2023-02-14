import { useState } from 'react';
import './App.scss';
import Header from './components/Header';
import Main from './components/Main.jsx';


function App() {

  const [theme, setTheme] = useState('light-mode');

  const toggleDarkMode = (event) => {
    const IS_CHECKED = event.target.checked;
    const THEME = IS_CHECKED ? 'dark-mode' : 'light-mode';
    setTheme(THEME);
  };

  return (
    <div className={`App ${theme}`}>
      <Header theme={theme} toggleTheme={toggleDarkMode} />
      <Main />
    </div>
  );
}

export default App;
