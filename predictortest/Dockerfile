# syntax=docker/dockerfile:1

FROM sbtscala/scala-sbt:openjdk-8u342_1.8.0_2.12.17

ADD practica_big_data_2019 /opt/spark-apps/practica_big_data_2019

WORKDIR /opt/spark-apps/practica_big_data_2019/flight_prediction

COPY predictor-entrypoint.sh /bin/predictor-entrypoint.sh
ENTRYPOINT ["predictor-entrypoint.sh"]
