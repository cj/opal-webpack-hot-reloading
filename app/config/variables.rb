Encoding.default_external = 'UTF-8'

# Load environment variables
%W{.env .env.#{ENV['RACK_ENV']}}.each do |file|
  File.foreach file do |line|
    key, value = line.split "=", 2; ENV[key] = value.gsub('\n', '').strip
  end if File.file? file
end
