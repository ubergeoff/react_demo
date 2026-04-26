FROM postgres:17-alpine

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=flight_booking

COPY init.sql /docker-entrypoint-initdb.d/01-init.sql

EXPOSE 5432
