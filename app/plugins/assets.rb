module Opal::Connect
  module ConnectPlugins
    module Assets
      module ClassMethods
        def assets_url(file)
          case file.to_s
          when /\.png$/
            "/public/images/#{file}"
          end
        end
      end

      module InstanceMethods
        def assets_url(file)
          self.class.assets_url(file)
        end
      end
    end

    register_plugin :assets, Assets
  end
end
