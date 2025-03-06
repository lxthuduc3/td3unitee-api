import admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVER_ACCOUNT)),
})

const firebaseAdmin = admin
export default firebaseAdmin
