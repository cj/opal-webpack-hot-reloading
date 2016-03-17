module Yah
  module Components
    class Layout
      include Opal::Connect

      if RUBY_ENGINE == 'opal'
        # import theme css
        `require('app/assets/css/style.css')`
        # import theme javascript
        `require('theme/jQuery/jquery-migrate-1.2.1.min.js')`
        `require('theme/bootstrap/js/bootstrap.min.js')`
        `require('theme/js/dropdown-menu/dropdown-menu.js')`
        `require('theme/js/fancybox/jquery.fancybox.pack.js')`
        `require('theme/js/fancybox/jquery.fancybox-media.js')`
        `require('theme/js/jquery.fitvids.js')`
        `require('theme/js/jquery.easy-pie-chart.js')`
        `require('theme/js/theme.js')`
      end

      if RUBY_ENGINE != 'opal'
        connect_load do
          # Using this as out layout template
          html = File.read './private/Buntington_HTML_pack/Buntington_HTML/index.html'
          # load the html into a dom element
          dom = Dom[html]
          # remove links and script tags
          dom.find('link, script').remove
          # Set the page title
          dom.find('title').text "Young Actor's House"
          # add in google fonts
          dom.find('head').append '<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,700,800" rel="stylesheet" type="text/css">'
          # save it in the connect cache
          dom.save!
        end
      end

      connect_on :click, '#test-server-link' do |evt|
        require 'console'

        $console.log 'moo'
      end

      def moo
        'cow'
      end

      def display
        dom       = Dom['html']
        container = dom.find('#k-body > .container')

        if RUBY_ENGINE == 'opal'
          container.append do
            h3 'from client'
          end
        else
          container.html do
            a'link from server', href: 'javascript:{};', id: 'test-server-link'
          end

          dom.to_s
        end
      end
    end
  end
end
