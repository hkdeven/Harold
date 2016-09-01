Rizzo::Application.configure do
  config.cache_classes = true
  config.serve_static_assets = true
  config.static_cache_control = "public, max-age=3600"

  # Production context
  config.assets.compress = true
  config.assets.compile = false
  config.assets.digest = true
  config.assets.initialize_on_precompile = false

  config.whiny_nils = true
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false
  config.action_dispatch.show_exceptions = false
  config.action_controller.allow_forgery_protection    = false
  config.active_support.deprecation = :stderr

  config.eager_load = true

end if defined?(Rizzo::Application)
