Unreloader.require './lib/opal/connect/dom.rb'
Unreloader.require './lib/opal/connect/html.rb'
Unreloader.require './lib/opal/connect/cache.rb'
Unreloader.require './lib/opal/connect.rb'

glob = './app/{components}/*.rb'
Dir[glob].each { |file| Unreloader.require file }

module Yah
  class Server < Roda
    use Rack::Session::Cookie, :secret => '123456'

    plugin :environments

    Opal::Connect.options do |config|
      if development?
        config[:hot_reload] = {
          host: "http://local.sh",
          port: 8080
        }
      end
    end

    if !development?
      plugin :assets,
        path: "#{Dir.pwd}",
        css_dir: '',
        js_dir: '',
        css: ['main.css'],
        js: ['main.js'],
        gzip: true,
        group_subdirs: false,
        compiled_name: 'main',
        compiled_path: "../dist",
        precompiled: './dist/precompiled.json'
    end

    route do |r|
      r.assets if RACK_ENV != 'development'

      r.on 'img' do
        r.run Rack::Directory.new("#{Dir.pwd}/private/Buntington_HTML_pack/Buntington_HTML/img")
      end

      # GET / request
      r.root do
        layout = Components::Layout.new
        layout.to_js :display
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
