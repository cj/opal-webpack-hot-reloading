# need to figure out how to make the opalrb compiler work with require_relative
$:.unshift(Dir.pwd)

require 'bundler'

RACK_ENV = ENV.fetch('RACK_ENV') { 'development' }
Bundler.setup :default, RACK_ENV

require 'rack/unreloader'
# Unreloader = Rack::Unreloader.new{App}
Unreloader = Rack::Unreloader.new(
  reload: RACK_ENV == 'development',
  subclasses: %w'Roda'
){Yah::Server}

require 'roda'

require 'oga'
require 'htmlentities'
require 'opal'
require 'opal/connect'

Opal.append_path Dir.pwd
Opal.use_gem 'opal-jquery'
Opal.use_gem 'opal-connect'

if RACK_ENV == 'development'
  require 'pry'
end

glob = './app/{components}/*.rb'
Dir[glob].each { |file| Unreloader.require file }

if RACK_ENV != 'development'
  assets             = JSON.parse File.read('./public/assets/assets.json')
  precompiled_assets = {}

  assets['main'].each do |key, value|
    precompiled_assets[key] = value .sub('main.', '') .gsub(/\.[a-z]{2,3}$/, '')
  end

  File.write("#{Dir.pwd}/public/assets/precompiled.json", precompiled_assets.to_json)
end

Unreloader.require './app/init.rb'
