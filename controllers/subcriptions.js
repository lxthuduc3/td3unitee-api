import Subscription from '../models/subscription.js'

export const getSubscriptions = async (req, res) => {
  const { home } = req.user
  const { topic, receiver } = req.query;

  try {
    let query = { home };

    if (topic) {
      query.topic = topic;
    }

    if (receiver) {
      query.user = receiver;
    }

    const subscriptions = await Subscription.find(query);

    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error('[getSubscriptions]', error);
    return res.status(500).json('Internal Server Error');
  }
};
export const getAdminSubscriptions = async (req, res) => {
  const { home } = req.user

  try {
    const adminSubs = await Subscription.aggregate([
      { $match: { home } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.role": "executiveBoard" } },
    ]);

    return res.status(200).json(adminSubs);
  } catch (error) {
    console.error('[getAdminSubscriptions]', error);
    return res.status(500).json('Internal Server Error');
  }
};



export const subscribe = async (req, res) => {
  const { id: user, home } = req.user
  const { endpoint, keys, topic } = req.body

  try {
    const subscription = await Subscription.findOneAndUpdate(
      { endpoint, topic },
      { user, home, keys },
      { upsert: true, new: true }
    )

    return res.status(200).json(subscription)
  } catch (error) {
    console.error('[subscribe]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const unsubscribe = async (req, res) => {
  const { id: user, home } = req.user
  const { endpoint } = req.body

  try {
    const subscription = await Subscription.findOneAndDelete({ endpoint, user, home })

    if (!subscription) {
      return res.status(404).json('Subscription Not Found')
    }

    return res.status(200).json('Unsubscribe Successfully')
  } catch (error) {
    console.error('[unsubscribe]', error)
    return res.status(500).json('Internal Server Error')
  }
}
