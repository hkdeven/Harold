# Be sure to restart your server when you modify this file.

# Your secret key for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!
# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
Rizzo::Application.config.secret_token = 'e7be74c89e72a13c3f627e3ef522dbc766d014eaf353e728dc5a55da5bcfc53244072762d2302ddc0bfb49b9c2d535f46357c39df2ca8dcdf0e408bfc28492ec'  if defined?(Rizzo::Application)
Rizzo::Application.config.secret_key_base = '60a22c3884c2e2def6c2797a86d42bc7c4a4074febf93b2a36819f7c28a3dcb06f55dbca977a09b24b71f2cbda71e2c1f714bfba2d81170a8b8cd6c59927d389'  if defined?(Rizzo::Application)
