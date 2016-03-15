require './app/unreloader'

namespace :webpack do
  required_files = Opal::Connect.files.map do |file|
    "require('#{file[1..-1]}')"
  end.join(';')

  builder = Opal::Builder.new
  builder.build_str('`require("expose?$!expose?jQuery!jquery")`; require "opal"; require "opal-jquery"; require "opal/connect";' + required_files, '(inline)')

  File.write "#{Dir.pwd}/.connect-opal.js", builder.to_s

  desc "Start webpack"
  task :run do
    exec({"OPAL_LOAD_PATH" => Opal.paths.join(":")}, "webpack-dev-server --progress -d --host 0.0.0.0 --port 8080 --devtool eval --progress --colors --historyApiFallback true --hot --content-base dist/ --watch --watch-polling")
  end

  desc "Build webpack"
  task :build do
    exec({"OPAL_LOAD_PATH" => Opal.paths.join(":")}, "webpack")
  end
end
