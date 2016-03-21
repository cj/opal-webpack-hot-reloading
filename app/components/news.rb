module Yah
  module Components
    class News
      include Opal::Connect

      events_dom '#moo'

      on :click, 'a' do |evt|
        evt.prevent_default

        puts 'moo'
      end

      def display
        Layout.scope(scope).display do
          html do
            div id: 'moo' do
              a 'test'
            end
          end
        end
      end unless RUBY_ENGINE == 'opal'
    end
  end
end
