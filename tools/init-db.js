import { connectToDB, disconnectToDB } from '../lib/db'
import Meal from '../models/meal'

const init = async () => {
  try {
    await connectToDB()

    const meals = await Meal.find()
    if (meals.length === 0) {
      const mealEntries = []
      for (let day = 0; day < 7; day++) {
        for (const meal of ['lunch', 'dinner']) {
          mealEntries.push({ day, meal })
        }
      }

      await Meal.insertMany(mealEntries)
      console.log('Default meals initialized.')
    } else {
      console.log('Meals already exist in the database.')
    }
  } catch (error) {
    console.error('Error initializing meals:', error)
  } finally {
    await disconnectToDB()
  }
}

init()
