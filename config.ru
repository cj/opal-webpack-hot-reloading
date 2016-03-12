require "roda"

class App < Roda
  use Rack::Session::Cookie, :secret => '123456'

  route do |r|
    # GET / request
    r.root do
      File.read('./index.html')
    end
  end
end

run App.freeze.app
