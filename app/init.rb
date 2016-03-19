module Yah
  class Server < Roda
    use Rack::Session::Cookie, :secret => '123456'

    plugin :environments

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
        css: ['never_used_but_needed_by_roda.css'],
        js: ['never_used_but_needed_by_roda.js'],
        gzip: true,
        headers: headers,
        group_subdirs: false,
        compiled_name: 'main',
        compiled_path: "../public/assets",
        precompiled: './public/assets/precompiled.json'
    end

    plugin :static, ['/img'],
      root: "#{Dir.pwd}/private/Buntington_HTML_pack/Buntington_HTML",
      header_rules: [ [:all, headers] ]

    plugin :static, ['/public'],
      root: "#{Dir.pwd}",
      header_rules: [ [:all, headers] ]

    route do |r|
      r.assets if RACK_ENV != 'development'

      r.post 'connect' do
        params = JSON.parse(request.body.read)

        # Make sure they are allowed to call that method
        if Opal::Connect.server_methods[params['klass']].include?(params['method'].to_sym)
          response['Content-Type'] = 'application/json'
          Object.const_get(params['klass'])
            .new
            .scope(self)
            .public_send(params['method'], *params['args']).to_json
        else
          response.status = 405
        end
      end

      # GET / request
      r.root do
        layout = Components::Layout.new.scope(self)
        layout.to_js :display
      end
    end
  end
end
