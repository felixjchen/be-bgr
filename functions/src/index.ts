import * as functions from 'firebase-functions';
import * as cors from 'cors';
const corsHandler = cors({ origin: true });

import config from './config';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const firebaseApp = initializeApp(config);
const db = getFirestore();

// export const helloWorld = functions.https.onRequest((request, response) => {
//   corsHandler(request, response, async () => {
//     const data = { structuredData: true };
//     functions.logger.info('reqbody', request.body);
//     functions.logger.info('Hello logs!', data);
//     response.send({ status: 'success', data: 'yessir' });
//   });
// });

const setSelectedColors = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    console.log(request.body.data);
    const { selected_colors } = request.body.data;
    await setDoc(
      doc(db, 'selected_colors', 'gJyrN2PRIqmcc0Z3F8j6'),
      selected_colors
    );
    response.send({ status: 'success', data: 'yessir' });
  });
});

const getSelectedColors = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    const selected_colors_doc: any = await getDoc(
      doc(db, 'selected_colors', 'gJyrN2PRIqmcc0Z3F8j6')
    );
    console.log(selected_colors_doc.data());
    response.send({ status: 'success', data: selected_colors_doc.data() });
  });
});

export { getSelectedColors, setSelectedColors };
