module Opal::Connect
  module ConnectPlugins
    module Pjax
      def self.load_dependencies(connect)
        connect.plugin :events
      end

      if RUBY_ENGINE == 'opal'
        `require('expose?$!expose?Pjax!pjax')`
        `require('expose?$!expose?NProgress!nprogress')`
        `require('nprogress/nprogress.css')`

        ConnectSetup = -> do
          on(:document, 'pjax:send') { `NProgress.start(); NProgress.inc()` }
          on(:document, 'pjax:complete') { `NProgress.done()` }

          `new Pjax({elements: 'a', selectors: ['#k-menu', '.container']})`
        end
      end
    end

    register_plugin :pjax, Pjax
  end
end
