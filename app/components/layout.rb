module Yah
  module Components
    class Layout
      include Opal::Connect

      if RUBY_ENGINE == 'opal'
        `require('app/assets/css/style.css')`
      end

      if RUBY_ENGINE != 'opal'
        on_load do
          # Using this as out layout template
          html = File.read './private/Buntington_HTML_pack/Buntington_HTML/index.html'
          # load the html into a dom element
          dom = Dom[html]
          # remove links and script tags
          dom.find('link, script').remove
          # Set the page title
          dom.find('title').text "Young Actor's House"
          # save it in the connect cache
          dom.save!
        end
      end

      def display
        if RUBY_ENGINE == 'opal'
          # Dom['body'].html Dom['title'].text
        else
          Dom['html'].to_s
        end
      end
    end
  end
end
