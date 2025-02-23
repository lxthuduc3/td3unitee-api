import Meal from '../model/meal.js'

export const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find().populate('mainDish vegie soup')
    return res.status(200).json(meals)
  } catch (error) {
    console.error('[getMeals]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const createMeal = async (req, res) => {
  const { day, meal, mainDish, vegie, soup } = req.body

  try {
    const newMeal = await Meal.create({ day, meal, mainDish, vegie, soup })
    return res.status(201).json(newMeal)
  } catch (error) {
    console.error('[createMeal]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const updateMeal = async (req, res) => {
  const { id } = req.params
  const { day, meal, mainDish, vegie, soup } = req.body

  try {
    const updatedMeal = await Meal.findByIdAndUpdate(id, { day, meal, mainDish, vegie, soup }, { new: true }).populate(
      'mainDish vegie soup'
    )

    if (!updatedMeal) {
      return res.status(404).json('Meal Not Found')
    }

    return res.status(200).json(updatedMeal)
  } catch (error) {
    console.error('[updateMeal]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const deleteMeal = async (req, res) => {
  const { id } = req.params

  try {
    const deletedMeal = await Meal.findByIdAndDelete(id)

    if (!deletedMeal) {
      return res.status(404).json('Meal Not Found')
    }

    return res.status(200).json({ message: 'Meal Deleted Successfully' })
  } catch (error) {
    console.error('[deleteMeal]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getMeal = async (req, res) => {
  const { day, meal } = req.params

  try {
    const foundMeal = await Meal.findOne({ day, meal }).populate('mainDish vegie soup')

    if (!foundMeal) {
      return res.status(404).json('Meal Not Found')
    }

    return res.status(200).json(foundMeal)
  } catch (error) {
    console.error('[getMeal]', error)
    return res.status(500).json('Internal Server Error')
  }
}
