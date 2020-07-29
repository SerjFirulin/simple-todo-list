FROM ruby:2.6.2

RUN apt-get update && apt-get install -y \
  curl \
  build-essential \
  libpq-dev &&\
  curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get install -y nodejs yarn

RUN mkdir /network
WORKDIR /network

#EXPOSE 3000

COPY Gemfile Gemfile.lock ./
RUN gem update bundler
RUN bundle install

COPY . .

RUN yarn install

CMD [ "bundle", "exec", "rails", "server", "-b", "0.0.0.0" , "-p" , "8080" ]
