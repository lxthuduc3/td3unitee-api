import TransactionCategory from '../models/transaction-category.js'

export const getTransactionCategories = (req, res) => {
  const { type } = req.query

  try {
    const category = TransactionCategory.find({ query })

    return res.status(200).json(category)
  } catch (error) {
    console.error('[getTransactionCategories]', error)
    return res.status(500).json('Internal Server Error')
  }
}
export const createTransactionCategory = (req, res) => {
  const { title, type } = req.body
  try {
    const category = TransactionCategory.create({ title, type })

    return res.status(201).json(category)
  } catch (error) {
    console.error('[createTransactionCategory]', error)
    return res.status(500).json('Internal Server Error')
  }
}
export const editTransactionCategory = (req, res) => {
  const { id } = req.params
  const { title } = req.body
  try {
    const category = TransactionCategory.findById(id, { title }, { new: true })

    if (!category) {
      return res.status(404).json('Transaction Category Not Found')
    }

    return res.status(200).json(category)
  } catch (error) {
    console.error('[editTransactionCategory]', error)
    return res.status(500).json('Internal Server Error')
  }
}
