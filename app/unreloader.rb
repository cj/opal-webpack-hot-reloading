# need to figure out how to make the opalrb compiler work with require_relative
$:.unshift(File.expand_path("./"))
# remove this once conenct is a gem
$:.unshift(File.expand_path("./lib"))

require 'bundler'

RACK_ENV = ENV.fetch('RACK_ENV') { 'development' }
Bundler.setup :default, RACK_ENV

require 'rack/unreloader'
# Unreloader = Rack::Unreloader.new{App}
Unreloader = Rack::Unreloader.new(:subclasses=>%w'Roda Opal Opal::Connect::HTML'){Yah::Server}
require 'roda'

require 'oga'
require 'htmlentities'
require 'opal'

Opal.append_path Dir.pwd
Opal.append_path "#{Dir.pwd}/lib"
Opal.use_gem 'opal-jquery'

require 'pry'

Unreloader.require './app/init.rb'
