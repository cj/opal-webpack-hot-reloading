require './app/unreloader'

namespace :webpack do
  Opal::Connect.setup

  builder = Opal::Builder.new
  build_str = '`require("expose?$!expose?jQuery!jquery")`; require "opal"; require "opal-jquery"; require "opal/connect";'
  builder.build_str(build_str, '(inline)')
  File.write "#{Dir.pwd}/.connect/opal.js", builder.to_s

  desc "Start webpack"
  task :run do
    exec({"OPAL_LOAD_PATH" => Opal.paths.join(":")}, "webpack-dev-server --progress -d --host 0.0.0.0 --port 8080 --compress --devtool eval --progress --colors --historyApiFallback true --hot --content-base dist/ --watch")
  end

  desc "Build webpack"
  task :build do
    exec({
      "OPAL_LOAD_PATH" => Opal.paths.join(":"),
      "RACK_ENV" => 'production'
    }, 'webpack --progress')
  end
end
