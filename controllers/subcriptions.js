import Subscription from '../models/subscription.js'

export const subscribe = async (req, res) => {
  const { id: user } = req.user
  const { token, topic } = req.body

  try {
    const subscription = await Subscription.findOneAndUpdate(
      { token },
      { user, token, topic },
      { upsert: true, new: true }
    )

    return res.status(200).json(subscription)
  } catch (error) {
    console.error('[subscribe]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const unsubscribe = async (req, res) => {
  const { id: user } = req.user
  const { token } = req.body

  try {
    const subscription = await Subscription.findOneAndDelete({ token, user })

    if (!subscription) {
      return res.status(404).json('Subscription Not Found')
    }

    return res.status(200).json('Unsubscribe Successfully')
  } catch (error) {
    console.error('[unsubscribe]', error)
    return res.status(500).json('Internal Server Error')
  }
}
