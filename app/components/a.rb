require 'app/components/test'

class A < Test
  include Opal::Connect

  def foo
    Element['body'].append '<div>required: world.rb</div>'
    Element['body'].append '<div>A#foo</div>'
    bar
    App.new.main
    moo
  end

  def bar
    Element['body'].append '<div>A#bar</div>'
  end
end
