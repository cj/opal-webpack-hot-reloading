# need to figure out how to make the opalrb compiler work with require_relative
$:.unshift(Dir.pwd)

require 'app/config/variables'

require 'bundler'

RACK_ENV = ENV.fetch('RACK_ENV') { 'development' }
Bundler.setup :default, RACK_ENV

require 'rack/unreloader'
Unreloader = Rack::Unreloader.new(
  reload: RACK_ENV == 'development',
  subclasses: %w'Roda'
){Yah::Server}

require 'roda'
require 'opal'
require 'opal/connect'

Opal.append_path Dir.pwd
Opal.use_gem 'opal-jquery'
Opal.use_gem 'opal-connect'

if RACK_ENV == 'development'
  require 'pry'
end

Opal::Connect.setup do |config|
  config[:plugins] = [:server, :html, :dom, :events, :scope]

  if RACK_ENV == 'development'
    config[:hot_reload] = {
      host: "http://local.sh",
      port: 8080,
    }
  end

  glob = './app/{components}/*.rb'
  Dir[glob].each { |file| Unreloader.require file }
end

assets_path = './public/assets/assets.json'

if RACK_ENV != 'development' && File.exist?(assets_path)
  assets             = JSON.parse File.read(assets_path)
  precompiled_assets = {}

  assets['main'].each do |key, value|
    precompiled_assets[key] = value .sub('main.', '') .gsub(/\.[a-z]{2,3}$/, '')
  end

  File.write("#{Dir.pwd}/public/assets/precompiled.json", precompiled_assets.to_json)
end

Unreloader.require './app/init.rb'
