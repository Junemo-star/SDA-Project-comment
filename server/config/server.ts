export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['5ec3a2de9cb0254b7e8f28493c143230b146f48f6d55997ecb3e47a0e54148b0', '0a25c79d9c1d8969e1b8e11690b993879d06240fe9ba0805e4117f957c6a4434']),
  },
});
