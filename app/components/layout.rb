module Yah
  module Components
    class Layout
      include Opal::Connect

      attr_reader :roda

      def initialize(roda = {})
        @roda = roda
      end

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

      server do
        def test_method
          {moo: 'cow'}
        end
      end unless RUBY_ENGINE == 'opal'

      setup do
        # Using this as out layout template
        html = File.read './private/Buntington_HTML_pack/Buntington_HTML/index.html'
        # load the html into a dom element
        dom.set!(html)
        # remove links and script tags
        dom.find('link, script').remove
        # Set the page title
        dom.find('title').text "Young Actor's House"
        # add in google fonts
        dom.find('head').append '<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,700,800" rel="stylesheet" type="text/css">'
        # save breadcrumbs as a template
        dom.find('#k-body > .container > .row:first-child')
          .attr('id', 'breadcrumbs')
          .save! :breadcrumbs
        # save slider
        slider = dom.find('#k-body > .container > .row:first-child')
          .attr('id', 'silder')
        # remove all but one item in the slider
        slider.find('.item:not(:first-child)').remove
        slider.find('#carousel-featured li:not(:first-child)').remove
        slider.save! :slider
        # layout-content
        dom.find('#k-body > .container > .row:first-child')
          .attr('id', 'layout-content')
          .save! :layout_content
        # save it in the connect cache
        dom.save!

        # 404 template
        dom.set! File.read './private/Buntington_HTML_pack/Buntington_HTML/404.html'

        dom.find('.container > .row:nth-child(2)')
           .attr('id', 'not_found')
           .save! :not_found
      end unless RUBY_ENGINE == 'opal'

      def display
        if RUBY_ENGINE == 'opal'
          server(:test_method).then do |response|
            puts response[:moo]
          end
        else
          breadcrumbs = dom.tmpl(:breadcrumbs)
          container   = dom.find('#k-body > .container:first-child')

          container.append breadcrumbs

          unless block_given?
            slider = dom.tmpl(:slider)
            container.append slider
          end

          container.append(yield) if block_given?

          unless RACK_ENV == 'development'
            dom.find('head').append roda.assets(:css)
            dom.find('html').append roda.assets(:js)
          end

          dom.to_s
        end
      end

      def not_found
        display { dom.tmpl(:not_found) }
      end
    end
  end
end
