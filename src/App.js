import React from 'react';
import ISSPeople from './components/ISSPeople';
import ISSPosition from './components/ISSPosition';

const App = () => {
  return (
    <div className="wrapper-large">
      <div className="ta-center">
        <h1>ISS</h1>
        <p className="fs-small">
          This project uses <a href="https://reactjs.org/">React</a> and <a href="https://leafletjs.com/">Leaflet</a> to visualize the position of the International Space Station (ISS).
          <br />Position and Astronaut data provided by <a href="http://open-notify.org/">Open Notify</a>.
        </p>
      </div>
      <h2 className="ta-center">Where is the ISS?</h2>
      <ISSPosition />
      <h2 className="ta-center">Who's Currently on the ISS?</h2>
      <div className="wrapper-small">
        <ISSPeople />
      </div>
    </div>
  );
}

export default App;