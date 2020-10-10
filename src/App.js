import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { StateProvider } from './context/State';
import { DrawingBoard, DrawingBoardCanvas } from './pages';
import './App.css';

function App() {
  return (
    <StateProvider>
      <Suspense fallback={'loading...'}>
        <div className="App">
          <BrowserRouter>
            <Switch>
              <Route path={'/canvas'} component={DrawingBoardCanvas} exact={true}/>
              <Route path={'/svg'} component={DrawingBoard} exact={true}/>
              <Route path={'/'} component={DrawingBoard} exact={true}/>
            </Switch>
          </BrowserRouter>
        </div>
      </Suspense>
    </StateProvider>
  );
}

export default App;
