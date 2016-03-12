# Opal corelib is already loaded from CDN
RACK_ENV = ENV.fetch('RACK_ENV') { 'development' }

`module.hot.accept()` if RACK_ENV == 'development'

class Wedge
  def self.require_files
    `require('./world.rb')`
  end
end

def talk
end

Document.ready? do
  Wedge.require_files

  Element['body'].html ''
  Element['body'].append '<div>from hello.rb</div>'
  A.new.foo
end
