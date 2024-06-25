import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Editor from './components/editor';
import NavBar from './components/NavBar';

const App = () => {
  const [exampleContent, setExampleContent] = useState('');

  const handleExampleLoad = (content) => {
    setExampleContent(content);
  };

  return (
    <div className="App">
      <NavBar onExampleLoad={handleExampleLoad} />
      <Editor example={exampleContent} />
    </div>
  );
};

export default App;
