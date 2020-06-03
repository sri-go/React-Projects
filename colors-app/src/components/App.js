import React from 'react';
import '../styles/App.css';
import randomColor from 'randomcolor/randomColor'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button } from 'react-bulma-components';

function App() {
  const color = randomColor();
  return (
    <div style={{display: 'flex',justifyContent:'center',alignItems:'center',height:'100vh', backgroundColor: 'lightsmoke'}}className="App">
      <Button style={{backgroundColor: color}}>Change Color</Button>
    </div>
  );
}

export default App;
