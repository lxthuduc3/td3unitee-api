import webpush from 'web-push'

webpush.setVapidDetails(
  `mailto:${process.env.ADMIN_EMAIL}`,
  process.env.WEBPUSH_VAPID_PUBLIC_KEY,
  process.env.WEBPUSH_VAPID_PRIVATE_KEY
)

export default webpush
