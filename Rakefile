require './app/unreloader'

namespace :webpack do
  FileUtils.mkdir_p("#{Dir.pwd}/.connect")
  `touch #{Dir.pwd}/.connect/entry.js`

  builder = Opal::Builder.new
  build_str = '`require("expose?$!expose?jQuery!jquery")`; require "opal"; require "opal-jquery"; require "opal/connect";'

  desc "Start webpack"
  task :run do
    builder.build_str(build_str, '(inline)', dynamic_require_severity: :ignore)
    File.write "#{Dir.pwd}/.connect/opal.js", builder.to_s

    exec({"OPAL_LOAD_PATH" => Opal.paths.join(":")}, "webpack-dev-server --progress -d --host 0.0.0.0 --port 8080 --compress --devtool eval --progress --colors --historyApiFallback true --hot --content-base dist/ --watch")
  end

  desc "Build webpack"
  task :build do
    required_files = Opal::Connect.files.map do |file|
      "require('#{file}')"
    end.join(';')
    builder.build_str( "#{build_str}#{required_files}", '(inline)', dynamic_require_severity: :ignore)
    File.write "#{Dir.pwd}/.connect/opal.js", builder.to_s
    # Opal::Connect.write_plugins_file
    exec({
      "OPAL_LOAD_PATH" => Opal.paths.join(":"),
      "RACK_ENV" => 'production'
    }, 'webpack --progress')
  end
end
