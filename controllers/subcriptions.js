import Subscription from '../models/subscription.js'

export const getSubscriptions = async (req, res) => {
  const { topic, receiver } = req.query;

  try {
    let query = {};

    if (topic) {
      query.topic = topic;
    }

    if (receiver) {
      query.receiver = receiver;
    }

    const subscriptions = await Subscription.find(query);

    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error('[getSubscriptions]', error);
    return res.status(500).json('Internal Server Error');
  }
};


export const subscribe = async (req, res) => {
  const { id: user } = req.user
  const { endpoint, keys, topic } = req.body

  try {
    const subscription = await Subscription.findOneAndUpdate(
      { endpoint, topic },
      { user, keys },
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
  const { endpoint } = req.body

  try {
    const subscription = await Subscription.findOneAndDelete({ endpoint, user })

    if (!subscription) {
      return res.status(404).json('Subscription Not Found')
    }

    return res.status(200).json('Unsubscribe Successfully')
  } catch (error) {
    console.error('[unsubscribe]', error)
    return res.status(500).json('Internal Server Error')
  }
}
