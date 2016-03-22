FROM mwallasch/docker-ruby-node

ENV PATH $PATH:./node_modules/.bin
ENV BUNDLE_PATH /app/.bundle

RUN bundle install
RUN npm install
RUN make build

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "./app/config/puma.rb"]
