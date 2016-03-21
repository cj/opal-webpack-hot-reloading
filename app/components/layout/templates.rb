module Yah
  module Components
    module LayoutTemplates
      module ClassMethods
        def menu(items = [])
          menu      = dom.find('#k-menu')
          menu_list = menu.find('ul')
          menu_list.find('li').remove

          items.each do |item|
            menu_list.append do
              li do
                a item[:name], href: item[:href], title: item[:title]
              end
            end
          end

          menu.parent.attr('id', 'header')
          menu.save! :menu
        end

        def breadcrumbs
          dom.find('#k-body > .container .k-breadcrumbs')
            .parent
            .attr('id', 'breadcrumbs')
            .save! :breadcrumbs
        end

        def slider
          slider = dom.find('#k-body > .container #carousel-featured')
                      .parent.parent
                      .attr('id', 'silder')
          # remove all but one item in the slider
          slider.find('.item:not(:first-child)').remove
          slider.find('#carousel-featured li:not(:first-child)').remove
          slider.save! :slider
        end

        def news
          dom.find('#k-body > .container > .row.no-gutter:last-child')
             .attr('id', 'layout-content')
             .save! :news
        end

        def logo
          dom.find('#k-site-logo img')
             .attr('src', assets_url('logo.png'))
             .parent
             .attr('href', '/')
        end

        def not_found
          not_found = dom.load! File.read './private/Buntington_HTML_pack/Buntington_HTML/404.html'

          not_found.find('.container > .row:nth-child(2)')
            .attr('id', 'not_found')
            .save! :not_found
        end

        def create_templates(*args)
          args.each { |tmpl| tmpl.is_a?(Hash) ? send(tmpl.first[0], tmpl.first[1]) : send(tmpl) }
          dom.save!
        end
      end
    end
  end
end
