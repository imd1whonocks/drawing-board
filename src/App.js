import React, { Suspense } from 'react';

import { StateProvider } from './context/State';
import './App.css';

function App() {
  return (
    <StateProvider>
      <Suspense fallback={'loading...'}>
        <div className="App">
          Drawing Board
        </div>
      </Suspense>
    </StateProvider>
  );
}

export default App;
