import { connectToDB, disconnectToDB } from '../lib/db.js'
import Home from '../models/home.js'
import Meal from '../models/meal.js'

const init = async () => {
  try {
    await connectToDB()

    const homes = await Home.find()
    if (homes.length === 0) {
      console.log('Chưa có home (nhà) nào trong hệ thống. Hãy tạo home trước, hoặc chạy tools/migrate-home.js.')
      return
    }

    for (const home of homes) {
      const meals = await Meal.find({ home: home._id })
      if (meals.length === 0) {
        const mealEntries = []
        for (let day = 0; day < 7; day++) {
          for (const meal of ['lunch', 'dinner']) {
            mealEntries.push({ home: home._id, day, meal })
          }
        }

        await Meal.insertMany(mealEntries)
        console.log(`Default meals initialized for home ${home.name}.`)
      } else {
        console.log(`Meals already exist for home ${home.name}.`)
      }
    }
  } catch (error) {
    console.error('Error initializing meals:', error)
  } finally {
    await disconnectToDB()
  }
}

init()
