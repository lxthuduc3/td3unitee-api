import Dish from '../models/dish.js'

export const getDishes = async (req, res) => {
  const { type } = req.query
  const query = {}

  if (type) query.type = type

  try {
    const dishes = await Dish.find(query)
    return res.status(200).json(dishes)
  } catch (error) {
    console.error('[getDishes]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const createDish = async (req, res) => {
  const { name, type, ingredients } = req.body

  try {
    const dish = await Dish.create({ name, type, ingredients })
    return res.status(201).json(dish)
  } catch (error) {
    console.error('[createDish]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const updateDish = async (req, res) => {
  const { id } = req.params
  const { name, type, ingredients } = req.body

  try {
    const dish = await Dish.findByIdAndUpdate(id, { name, type, ingredients }, { new: true })

    if (!dish) {
      return res.status(404).json('Dish Not Found')
    }

    return res.status(200).json(dish)
  } catch (error) {
    console.error('[updateDish]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const deleteDish = async (req, res) => {
  const { id } = req.params

  try {
    const dish = await Dish.findByIdAndDelete(id)

    if (!dish) {
      return res.status(404).json('Dish Not Found')
    }

    return res.status(200).json({ message: 'Dish Deleted Successfully' })
  } catch (error) {
    console.error('[deleteDish]', error)
    return res.status(500).json('Internal Server Error')
  }
}
