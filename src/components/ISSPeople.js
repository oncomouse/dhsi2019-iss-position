import fetch from 'isomorphic-fetch';
import React, { useEffect, useState } from 'react';
import styles from './ISSPeople.module.scss'

const url = 'https://andrew.pilsch.com/dhsi19/astros.json';

const ISSPeople = () => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setPeople(json.people)
      })
  }, [])

  return (
    <ul className={styles.peopleList}>
      {people.map((person, i) => <li key={i}><a href={`https://en.wikipedia.org/wiki/${person.name.replace(/\s+/g,'_')}`}>{person.name}</a></li>)}
    </ul>
  )
}

export default ISSPeople;