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

    headers = {
      'Cache-Control' => 'public, max-age=2592000, no-transform',
      'Connection' => 'keep-alive',
      'Age' => '25637',
      'Strict-Transport-Security' => 'max-age=315'
    }

    unless development?
      plugin :assets,
        path: "#{Dir.pwd}",
        css_dir: '',
        js_dir: '',
        css: ['main.css'],
        js: ['main.js'],
        gzip: true,
        headers: headers,
        group_subdirs: false,
        compiled_name: 'main',
        compiled_path: "../dist/assets",
        precompiled: './dist/precompiled.json'
    end

    plugin :static, ['/img'],
      root: "#{Dir.pwd}/private/Buntington_HTML_pack/Buntington_HTML",
      header_rules: [ [:all, headers] ]

    plugin :static, ['/dist'],
      root: "#{Dir.pwd}",
      header_rules: [ [:all, headers] ]

    route do |r|
      r.assets if RACK_ENV != 'development'

      r.on 'connect' do
        response['Content-Type'] = 'application/json'
        params = JSON.parse(request.body.read)
        Object.const_get(params['klass']).new.__send__(params['method'], *params['args']).to_json
      end

      # GET / request
      r.root do
        layout = Components::Layout.new(self)
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
