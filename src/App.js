import React, { Suspense } from 'react';

import { StateProvider } from './context/State';
import {DrawingBoard} from './pages'
import './App.css';

function App() {
  return (
    <StateProvider>
      <Suspense fallback={'loading...'}>
        <div className="App">
          <DrawingBoard />
        </div>
      </Suspense>
    </StateProvider>
  );
}

export default App;
