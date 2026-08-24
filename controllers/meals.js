import Meal from '../models/meal.js'
import MealRegistration from '../models/meal-registration.js'

export const getMeals = async (req, res) => {
  const { home } = req.user

  try {
    const meals = await Meal.find({ home }).populate('mainDish vegie soup')
    return res.status(200).json(meals)
  } catch (error) {
    console.error('[getMeals]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const createMeal = async (req, res) => {
  const { home } = req.user
  const { day, meal, mainDish, vegie, soup } = req.body

  try {
    const newMeal = await Meal.create({ home, day, meal, mainDish, vegie, soup })
    return res.status(201).json(newMeal)
  } catch (error) {
    console.error('[createMeal]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const updateMeal = async (req, res) => {
  const { home } = req.user
  const { id } = req.params
  const { day, meal, mainDish, vegie, soup } = req.body

  try {
    const updatedMeal = await Meal.findOneAndUpdate(
      { _id: id, home },
      { day, meal, mainDish, vegie, soup },
      { new: true }
    ).populate('mainDish vegie soup')

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
  const { home } = req.user
  const { id } = req.params

  try {
    const deletedMeal = await Meal.findOneAndDelete({ _id: id, home })

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
  const { home } = req.user
  const { day, meal } = req.params

  try {
    const foundMeal = await Meal.findOne({ home, day, meal }).populate('mainDish vegie soup')

    if (!foundMeal) {
      return res.status(404).json('Meal Not Found')
    }

    return res.status(200).json(foundMeal)
  } catch (error) {
    console.error('[getMeal]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const calculateIngredientsToBuy = async (req, res) => {
  const { home } = req.user
  const { meals } = req.body

  try {
    const ingredients = await MealRegistration.aggregate([
      {
        // Get all meal registrations in selected meals, trong home hiện tại
        $match: {
          home,
          $or: meals.map(({ date, meal }) => ({
            date: new Date(date),
            meal,
          })),
        },
      },
      {
        // Group to calculate number of eaters for each meals
        $group: {
          _id: { date: '$date', meal: '$meal' },
          eaters: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          meal: '$_id.meal',
          eaters: 1,
          day: {
            $mod: [
              {
                $subtract: [{ $dayOfWeek: { $add: ['$_id.date', 1000 * 60 * 60 * 7] } }, 1],
              },
              7,
            ],
          },
        },
      },
      {
        // Lookup the menu
        $lookup: {
          from: 'meals',
          let: { mealType: '$meal', day: '$day' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$meal', '$$mealType'] }, { $eq: ['$day', '$$day'] }, { $eq: ['$home', home] }],
                },
              },
            },
          ],
          as: 'menu',
        },
      },
      { $unwind: { path: '$menu', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'dishes',
          localField: 'menu.mainDish',
          foreignField: '_id',
          as: 'menu.mainDish',
        },
      },
      { $unwind: { path: '$menu.mainDish', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'dishes',
          localField: 'menu.vegie',
          foreignField: '_id',
          as: 'menu.vegie',
        },
      },
      { $unwind: { path: '$menu.vegie', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'dishes',
          localField: 'menu.soup',
          foreignField: '_id',
          as: 'menu.soup',
        },
      },
      { $unwind: { path: '$menu.soup', preserveNullAndEmptyArrays: true } },
      {
        // Flatten all ingredients into a single array
        $project: {
          date: 1,
          meal: 1,
          eaters: 1,
          ingredients: {
            $concatArrays: ['$menu.mainDish.ingredients', '$menu.vegie.ingredients', '$menu.soup.ingredients'],
          },
        },
      },
      { $unwind: { path: '$ingredients', preserveNullAndEmptyArrays: true } },
      {
        // Scale ingredient amounts
        $project: {
          _id: 0,
          name: '$ingredients.name',
          unit: '$ingredients.unit',
          amount: { $multiply: ['$ingredients.amount', { $divide: ['$eaters', 30] }] },
        },
      },
      {
        $group: {
          _id: '$name',
          amount: { $sum: '$amount' },
          units: { $addToSet: '$unit' },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          unit: { $arrayElemAt: ['$units', 0] },
          amount: {
            $let: {
              vars: {
                intPart: { $floor: '$amount' },
                fracPart: { $mod: ['$amount', 1] },
              },
              in: {
                $cond: [{ $lt: ['$$fracPart', 0.5] }, { $add: ['$$intPart', 0.5] }, { $ceil: '$amount' }],
              },
            },
          },
        },
      },
    ])

    return res.status(200).json(ingredients)
  } catch (error) {
    console.error('[calculateIngredientsToBuy]', error)
    return res.status(500).json('Internal Server Error')
  }
}
