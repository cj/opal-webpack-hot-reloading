FROM ubuntu:trusty

ENV OS_LOCALE="en_US.UTF-8"
RUN locale-gen ${OS_LOCALE}
ENV LANG=${OS_LOCALE} \
  LANGUAGE=en_US:en \
  LC_ALL=${OS_LOCALE}

ADD ./config /config

# Install packages for building ruby
RUN apt-get update
RUN apt-get install -y --force-yes build-essential curl git
RUN apt-get install -y --force-yes zlib1g-dev libssl-dev libreadline-dev libyaml-dev libxml2-dev libxslt-dev wget
# for node
RUN apt-get install -y python python-dev python-pip python-virtualenv
# for nokogiri
RUN apt-get install -y libxml2-dev libxslt1-dev
# for capybara-webkit
RUN apt-get install -y libqt4-webkit libqt4-dev xvfb
RUN apt-get clean
# cleanup
RUN rm -rf /var/lib/apt/lists/*

# Install rbenv and ruby-build
RUN git clone https://github.com/sstephenson/rbenv.git /root/.rbenv
RUN git clone https://github.com/sstephenson/ruby-build.git /root/.rbenv/plugins/ruby-build
RUN ./root/.rbenv/plugins/ruby-build/install.sh
ENV PATH /root/.rbenv/bin:$PATH
RUN echo 'eval "$(rbenv init -)"' >> /etc/profile.d/rbenv.sh # or /etc/profile

# Install multiple versions of ruby
ENV CONFIGURE_OPTS --disable-install-doc
RUN xargs -L 1 rbenv install < /config/versions.txt

# Install Bundler for each version of ruby
RUN echo 'gem: --no-rdoc --no-ri' >> /.gemrc
RUN /bin/sh -l -c 'for v in $(cat /root/versions.txt); do rbenv global $v; gem install bundler; done'

# install nodejs
RUN \
  cd /tmp && \
  wget http://nodejs.org/dist/node-latest.tar.gz && \
  tar xvzf node-latest.tar.gz && \
  rm -f node-latest.tar.gz && \
  cd node-v* && \
  ./configure && \
  CXX="g++ -Wno-unused-local-typedefs" make && \
  CXX="g++ -Wno-unused-local-typedefs" make install && \
  cd /tmp && \
  rm -rf /tmp/node-v* && \
  npm install -g npm && \
  echo '\n# Node.js\nexport PATH="node_modules/.bin:$PATH"' >> /root/.bashrc

RUN echo 'export PATH="/root/.rbenv/bin:$PATH"' >> /root/.bashrc
RUN echo 'export BUNDLE_PATH=/app/.bundle' >> /root/.bashrc
RUN echo 'export PATH=$PATH:./node_modules/.bin' >> /root/.bashrc
RUN echo 'eval "$(rbenv init -)"' >> /root/.bashrc
ENV PATH $PATH:./node_modules/.bin
ENV BUNDLE_PATH: /app/.bundle

WORKDIR /app
ONBUILD ADD . /app

EXPOSE 3000

ENTRYPOINT ["/bin/bash", "-l", "-c", "/config/entrypoint.sh"]
