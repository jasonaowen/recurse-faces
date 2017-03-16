FROM frolvlad/alpine-python3:latest
WORKDIR /apps
COPY requirements.txt /apps/
RUN apk update \
  && apk add --no-cache \
  --virtual=.build-dependencies g++ musl-dev \
  && apk add --no-cache python3-dev postgresql-dev postgresql-client \
  && pip install virtualenv \
  && virtualenv ENV \
  && pip install -r requirements.txt \
  && rm -r /root/.cache \
  && rm /apps/requirements.txt \
  && apk del .build-dependencies postgresql
