const isProd = process.env.NODE_ENV === 'production'

const config = {
  isProd,
  serverUrlPrefix: isProd ? 'http://34.87.40.14' : 'http://localhost:1337'
}

export default config;