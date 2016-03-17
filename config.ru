require './app/unreloader'

run RACK_ENV != 'development' ? Yah::Server : Unreloader
