$: << 'lib'
require "rizzo/version"
require "rizzo/url_encryptor"
require "rizzo/url_validator"
require "rizzo/assets"

module Rizzo

end

require "rizzo/engine" if defined?(Rails)

