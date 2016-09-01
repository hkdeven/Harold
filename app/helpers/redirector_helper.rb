module RedirectorHelper
  # Helper method for generating redirection links.
  MAX_URL_LENGTH = 1900
  #
  # Usage:
  #     redirector_to("http://foo.bar/com?zap") # => "r/oin23o98c9jwhd982j398=23n9823nj"
  #     redirector_to("http://my.long.url")     # => "http://my.long.url
  #
  # If the encrypted url would be too long, the original target_url is
  # returned, and a Fozzie count is incremented.
  #
  # @param <String> target_url url to be redirected to. This will be encrypted.
  # @return <String> If the encrypted url is less than MAX_URL_LENGTH,
  #   it returns path to redirector controller #show action, with
  #   encrypted target_url. Otherwise, it returns original target_url.
  #
  #
  def redirector_to(target_url)
    encrypted_url = Rizzo::UrlEncryptor.encrypt(target_url)
    length        = encrypted_url.length
    if length < MAX_URL_LENGTH
      redirector_path :encrypted_url => encrypted_url
    else
      target_url
    end
  end
end
