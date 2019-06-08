import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'leaflet';
import { Map, LayerGroup, Marker, TileLayer, Polyline, Tooltip } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { append, compose, init, last } from 'ramda';
import useInterval from '../utilities/useInterval';
import styles from './ISSPosition.module.scss';

const URL = 'https://andrew.pilsch.com/dhsi19/iss-now.json';
const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const colors = [
  '#0074D9',
  '#7FDBFF',
  '#39CCCC',
  '#3D9970',
  '#2ECC40',
  '#01FF70',
  '#FFDC00',
  '#FF851B',
  '#FF4136',
  '#85144b',
  '#F012BE',
  '#B10DC9',
  '#111111',
  '#AAAAAA',
  '#DDDDDD',
  '#001f3f'
];

const indexToColor = index => colors[index >= 16 ? index % 16 : index];

const CustomPolyLine = (props) => {
  const {
    position,
    setCenter
  } = props;

  const [positions, setPositions] = useState([[]]);
  const previousLong = useRef(null);

  useEffect(() => {
    if (typeof previousLong.current === 'number' && previousLong.current > 150 && position[1] < -150) {
      setPositions(append([position]));
      setCenter(position);
    } else {
      setPositions(positions => [
        ...init(positions),
        compose(append(position), last)(positions)
      ])
    }
    previousLong.current = position[1];
  }, [position]);
  return <LayerGroup>{positions.map((line, i) => <Polyline color={indexToColor(i)} positions={line} key={i} />)}</LayerGroup>
}

const ISSPosition = () => {
  const [position, setPosition] = useState(null);
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState([0, 0]);
 
  const getISSPosition = (cb=()=>true) => {
    fetch(URL)
      .then(response => response.json())
      .then(json => [
        parseFloat(json.iss_position.latitude, 10),
        parseFloat(json.iss_position.longitude, 10) // -180 is international
      ]).then(position => {
        setPosition(position);
        return position;
      })
      .then(cb)
  };

  useEffect(() => getISSPosition(setCenter), []);
  useInterval(getISSPosition, 500);

  const recenter = () => setCenter(position);

  const onZoomEnd = ev => setZoom(ev.target.getZoom());
  const onMoveEnd = ev => setCenter(ev.target.getCenter());

  return position === null ? null : (
    <Map
      onZoomEnd={onZoomEnd}
      onMoveEnd={onMoveEnd}
      animate={true}
      className={styles.container}
      center={center}
      zoom={zoom}
    >
      <TileLayer
        url={TILE_LAYER_URL}
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <CustomPolyLine position={position} setCenter={setCenter} />
      <Control position="topleft" className={styles.leafletCustomControl + " leaflet-control leaflet-bar"}>
        <button onClick={recenter} alt="Recenter on ISS">◎</button>
      </Control>
      <Marker position={position} icon={new Icon({
        iconUrl: `${process.env.PUBLIC_URL}/ISS.png`,
        iconSize: [75, 30],
        iconAnchor: [25, 15],
      })}>
        <Tooltip sticky>The International Space Station</Tooltip>
      </Marker>
    </Map>
  );
}

export default ISSPosition;