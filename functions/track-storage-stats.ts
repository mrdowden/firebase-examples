import { onObjectDeleted, onObjectFinalized } from 'firebase-functions/v2/storage'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

export const bucket_onCreate_trackFileSize = onObjectFinalized((event) => {
  const filePath = event.data.name
  const fileSize = event.data.size
  const uid = filePath.match(/users\/([^/]+)\/images\//)[1]
  
  return getFirestore().collection('access').doc(uid).set({
    totalStorageUsed: FieldValue.increment(Number(fileSize))
  }, { merge: true })
})

export const bucket_onDelete_trackFileSize = onObjectDeleted((event) => {
  const filePath = event.data.name
  const fileSize = event.data.size
  const uid = filePath.match(/users\/([^/]+)\/images\//)[1]
  
  return getFirestore().collection('access').doc(uid).set({
    totalStorageUsed: FieldValue.increment(Number(-fileSize))
  }, { merge: true })
})
