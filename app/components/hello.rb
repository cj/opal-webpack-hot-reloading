require 'app/components/a'

if RUBY_ENGINE == 'opal'
`require('app/assets/css/style.css')`
end

module Yah
  module Components
    class Hello
      include Opal::Connect

      def world(options = {})
        if RUBY_ENGINE == 'opal'
          Element['body'].html ''
          Element['body'].append html { div 'Hello, World!' }

          if name = options.delete(:name)
            Element['body'].append html { div "Hello, #{name}!" }
          end

          A.new.foo
        else
          File.read('./index.html')
        end
      end
    end
  end
end
