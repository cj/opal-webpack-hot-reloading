# need to figure out how to make the opalrb compiler work with require_relative
$:.unshift(File.expand_path("./"))
# remove this once conenct is a gem
$:.unshift(File.expand_path("./lib"))

require 'bundler'

RACK_ENV = ENV.fetch('RACK_ENV') { 'development' }
Bundler.setup :default, RACK_ENV

require 'rack/unreloader'
# Unreloader = Rack::Unreloader.new{App}
Unreloader = Rack::Unreloader.new(
  reload: RACK_ENV == 'development',
  subclasses: %w'Roda Opal Opal::Connect::HTML Opal::Connect::Dom'
){Yah::Server}

require 'roda'

require 'oga'
require 'htmlentities'
require 'opal'

Opal.append_path Dir.pwd
Opal.append_path "#{Dir.pwd}/lib"
Opal.use_gem 'opal-jquery'

if RACK_ENV == 'development'
  require 'pry'
end

Unreloader.require './lib/opal/connect/dom.rb'
Unreloader.require './lib/opal/connect/html.rb'
Unreloader.require './lib/opal/connect/cache.rb'
Unreloader.require './lib/opal/connect/server.rb'
Unreloader.require './lib/opal/connect.rb'

glob = './app/{components}/*.rb'
Dir[glob].each { |file| Unreloader.require file }

if RACK_ENV != 'development'
  assets             = JSON.parse File.read('./dist/assets.json')
  precompiled_assets = {}

  assets['main'].each do |key, value|
    precompiled_assets[key] = value .sub('main.', '') .gsub(/\.[a-z]{2,3}$/, '')
  end

  File.write("#{Dir.pwd}/dist/precompiled.json", precompiled_assets.to_json)
end

Unreloader.require './app/init.rb'
