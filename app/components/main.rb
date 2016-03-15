class App
  include Opal::Connect

  def main
    Element['body'].append '<div>Just created a nested file and folder app/main.rb</div>'
  end
end
