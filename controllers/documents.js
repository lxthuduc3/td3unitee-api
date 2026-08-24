import Document from '../models/document.js'

export const getDocuments = async (req, res) => {
  const { home } = req.user
  const { category } = req.query
  try {
    const documents = await Document.find(category ? { home, category } : { home })
      .select('title creator category createdAt')
      .populate('creator', 'familyName givenName avatar')
    return res.status(200).json(documents)
  } catch (error) {
    console.error('[getDocuments]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getDocument = async (req, res) => {
  const { home } = req.user
  const { id } = req.params
  try {
    const document = await Document.findOne({ _id: id, home }).populate('creator', 'familyName givenName avatar')
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
  const { id: creator, home } = req.user
  const { title, content, createdAt, category } = req.body
  try {
    const document = await Document.create({ title, content, createdAt, category, creator, home })
    return res.status(201).json(document)
  } catch (error) {
    console.error('[createDocument]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const editDocument = async (req, res) => {
  const { home } = req.user
  const { id } = req.params
  const { title, content } = req.body
  try {
    const document = await Document.findOneAndUpdate({ _id: id, home }, { title, content }, { new: true })
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
  const { home } = req.user
  const { id } = req.params
  try {
    const document = await Document.findOneAndDelete({ _id: id, home })
    if (!document) {
      return res.status(404).json('Document Not Found')
    }
    return res.status(200).json('Document Deleted Successfully')
  } catch (error) {
    console.error('[deleteDocument]', error)
    return res.status(500).json('Internal Server Error')
  }
}
