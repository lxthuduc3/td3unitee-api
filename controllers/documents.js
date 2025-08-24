import Document from '../models/document.js'

export const getDocuments = async (req, res) => {
  const { category } = req.query
  try {
    const documents = await Document.find(category ? { category } : {})
      .select('title creator category createdAt')
      .populate('creator', 'familyName givenName avatar')
    return res.status(200).json(documents)
  } catch (error) {
    console.error('[getDocuments]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getDocument = async (req, res) => {
  const { id } = req.params
  try {
    const document = await Document.findById(id).populate('creator', 'familyName givenName avatar')
    if (!document) {
      return res.status(404).json('Document Not Found')
    }
    return res.status(200).json(document)
  } catch (error) {
    console.error('[getDocument]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const createDocument = async (req, res) => {
  const { id: creator } = req.user
  const { title, content, createdAt, category } = req.body
  try {
    const document = await Document.create({ title, content, createdAt, category, creator })
    return res.status(201).json(document)
  } catch (error) {
    console.error('[createDocument]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const editDocument = async (req, res) => {
  const { id } = req.params
  const { title, content } = req.body
  try {
    const document = await Document.findByIdAndUpdate(id, { title, content }, { new: true })
    if (!document) {
      return res.status(404).json('Document Not Found')
    }
    return res.status(200).json(document)
  } catch (error) {
    console.error('[editDocument]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const deleteDocument = async (req, res) => {
  const { id } = req.params
  try {
    const document = await Document.findByIdAndDelete(id)
    if (!document) {
      return res.status(404).json('Document Not Found')
    }
    return res.status(200).json('Document Deleted Successfully')
  } catch (error) {
    console.error('[deleteDocument]', error)
    return res.status(500).json('Internal Server Error')
  }
}
