import * as functions from 'firebase-functions';
import * as cors from 'cors';
const corsHandler = cors({ origin: true });

import config from './config';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as pg from 'pg';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const firebaseApp = initializeApp(config);
const db = getFirestore();

//  docker run --name postgres_container -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
// create table selected_colors (
// 	player_name VARCHAR(255) primary key,
// 	color VARCHAR(255)
// )

const client = new pg.Client('postgres://postgres:mysecretpassword@localhost');
client.connect();

console.log({ firebaseApp });

const setSelectedColors = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    console.log(request.body.data);
    const { selected_colors } = request.body.data;
    for (const player in selected_colors) {
      const queryText = `INSERT INTO selected_colors (player_name, color)
                          VALUES($1,$2) 
                          ON CONFLICT (player_name) 
                          DO 
                            UPDATE SET color=$2`;
      const res = await client.query(queryText, [
        player,
        selected_colors[player],
      ]);
    }
    response.send({ status: 'success', data: 'yessir' });
  });
});

const getSelectedColors = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    const res = await client.query('select * from selected_colors');
    let selected_colors: any = {};
    res.rows.forEach((row) => {
      let player_name: string = row.player_name;
      let color: string = row.color;
      selected_colors[player_name] = color;
    });
    console.log(res.rows);
    response.send({ status: 'success', data: selected_colors });
  });
});

export { getSelectedColors, setSelectedColors };
