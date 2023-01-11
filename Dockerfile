FROM postgres:15.0-alpine
COPY ./init.sql /docker-entrypoint-initdb.d/10-init.sql
