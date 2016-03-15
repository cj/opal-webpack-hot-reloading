class Test
  include Opal::Connect

  def moo
    if RUBY_ENGINE == 'opal'
      Element['body'].append '<div>cow</div>'
    else
      'test'
    end
  end
end
