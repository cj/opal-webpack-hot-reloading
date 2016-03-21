# module Yah
#   module Components
#     class Layout
#       module Pjax
#         include Opal::Connect
#
#         if RUBY_ENGINE == 'opal'
#           `require('expose?$!expose?Pjax!pjax')`
#           `require('expose?$!expose?NProgress!nprogress')`
#           `require('nprogress/nprogress.css')`
#
#           on(:document, 'pjax:send') { `NProgress.start(); NProgress.inc()` }
#           on(:document, 'pjax:complete') { `NProgress.done()` }
#
#           setup { `new Pjax({elements: 'a', selectors: ['#k-menu', '.container']})` }
#         end
#       end
#     end
#   end
# end
