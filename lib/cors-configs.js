export const corsUser = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
}

export const corsAdmin = {
  origin: process.env.CLIENT_ADMIN_URL,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
}

export const corsBoth = {
  origin: [process.env.CLIENT_URL, process.env.CLIENT_ADMIN_URL],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
}
