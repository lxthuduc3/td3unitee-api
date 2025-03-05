import admin from 'firebase-admin'
import { readFile } from 'fs/promises'

const serviceAccount = JSON.parse(await readFile(new URL('../firebase-adminsdk.json', import.meta.url)))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const firebaseAdmin = admin
export default firebaseAdmin
