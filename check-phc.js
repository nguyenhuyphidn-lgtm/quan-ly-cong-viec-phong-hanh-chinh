import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "task-manager-bana",
  appId: "1:115743022103:web:373b893063d8fddfaa1052",
  storageBucket: "task-manager-bana.firebasestorage.app",
  apiKey: "AIzaSyDLD6bSKmgLewN2yly4_K2IvEpKpMfvkIA",
  authDomain: "task-manager-bana.firebaseapp.com",
  messagingSenderId: "115743022103"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const tasksSnap = await getDocs(collection(db, 'phc_tasks'));
  console.log(`phc_tasks doc count in Firestore: ${tasksSnap.size}`);
  tasksSnap.forEach((doc) => {
    console.log(`- STT: ${doc.id}, Content: ${doc.data().noiDung}`);
  });

  const staffSnap = await getDocs(collection(db, 'phc_staff'));
  console.log(`phc_staff doc count in Firestore: ${staffSnap.size}`);
}

check().catch(console.error);
