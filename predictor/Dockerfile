# syntax=docker/dockerfile:1

FROM sbtscala/scala-sbt:openjdk-8u342_1.8.0_2.12.17

ADD practicaBD /opt/spark-apps/practicaBD
#ADD spark-3.1.2-bin-hadoop3.2 /opt/spark

WORKDIR /opt/spark-apps/practicaBD/flight_prediction

COPY predictor-entrypoint.sh /bin/predictor-entrypoint.sh
ENTRYPOINT ["predictor-entrypoint.sh"]
