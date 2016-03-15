Unreloader.require './lib/opal/connect/html.rb'
Unreloader.require './lib/opal/connect/cache.rb'
Unreloader.require './lib/opal/connect.rb'

glob = './app/{components}/*.rb'
Dir[glob].each { |file| Unreloader.require file }

module Yah
  class Server < Roda
    use Rack::Session::Cookie, :secret => '123456'

    plugin :assets, js: 'main.js'

    Opal::Connect.options do |config|
      config[:hot_reload] = {
        host: "http://local.sh",
        port: 8080
      }
    end

    route do |r|
      r.assets

      # GET / request
      r.root do
        # html = File.read('./index.html')
        # html
        'hey'
      end

      r.on 'hello' do
        hello = Components::Hello.new
        hello.to_js :world, name: 'cj'
      end

      r.on 'test' do
        test = Test.new
        test.to_js :moo
      end
    end
  end
end
