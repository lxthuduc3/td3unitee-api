import TransactionCategory from '../models/transaction-category.js'

export const getTransactionCategories = async (req, res) => {
  const { home } = req.user
  const { type } = req.query

  try {
    const category = await TransactionCategory.find({ home, type })

    return res.status(200).json(category)
  } catch (error) {
    console.error('[getTransactionCategories]', error)
    return res.status(500).json('Internal Server Error')
  }
}
export const createTransactionCategory = async (req, res) => {
  const { home } = req.user
  const { title, type } = req.body
  try {
    const category = await TransactionCategory.create({ home, title, type })

    return res.status(201).json(category)
  } catch (error) {
    console.error('[createTransactionCategory]', error)
    return res.status(500).json('Internal Server Error')
  }
}
export const editTransactionCategory = async (req, res) => {
  const { home } = req.user
  const { id } = req.params
  const { title, type } = req.body
  try {
    const category = await TransactionCategory.findOneAndUpdate({ _id: id, home }, { title, type }, { new: true })

    if (!category) {
      return res.status(404).json('Transaction Category Not Found')
    }

    return res.status(200).json(category)
  } catch (error) {
    console.error('[editTransactionCategory]', error)
    return res.status(500).json('Internal Server Error')
  }
}
