import { Router } from 'express'
import { getDocuments, getDocument, createDocument, editDocument, deleteDocument } from '../controllers/documents.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const documentsRouter = Router()

documentsRouter.get('/documents', authenticateUser, getDocuments)
documentsRouter.get('/documents/:id', authenticateUser, getDocument)
documentsRouter.post('/documents', authenticateUser, checkAdminPermission, createDocument)
documentsRouter.patch('/documents/:id', authenticateUser, checkAdminPermission, editDocument)
documentsRouter.delete('/documents/:id', authenticateUser, checkAdminPermission, deleteDocument)

export default documentsRouter
