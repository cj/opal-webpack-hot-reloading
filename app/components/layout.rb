require 'app/components/layout/templates' unless RUBY_ENGINE == 'opal'

module Yah
  module Components
    class Layout
      include Opal::Connect

      plugin LayoutTemplates  unless RUBY_ENGINE == 'opal'

      if RUBY_ENGINE == 'opal'
        `require('app/components/layout/theme.css')`
        `require('app/components/layout/theme.js')`
      end

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

        create_templates :breadcrumbs, :slider, :news, :logo, :not_found, menu: [
          { name: 'News', title: 'Latest News', href: '/news' },
          { name: 'Events', title: 'Upcoming Events', href: '/events' },
          { name: 'Services', title: 'Available Services', href: '/services' },
          { name: 'About', title: 'The Staff', href: '/services' },
          { name: 'Contact Us', title: 'Get in touch', href: '/contact' },
        ]
      end unless RUBY_ENGINE == 'opal'

      def display
        if RUBY_ENGINE != 'opal'
          dom.find('#header').append dom.tmpl(:menu)
          breadcrumbs = dom.tmpl(:breadcrumbs)
          container   = dom.find('#k-body > .container:first-child')

          container.append breadcrumbs

          unless block_given?
            slider = dom.tmpl(:slider)
            container.append slider
          end

          container.append(yield) if block_given?

          unless RACK_ENV == 'development'
            dom.find('head').append assets(:css)
            dom.find('html').append assets(:js)
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
