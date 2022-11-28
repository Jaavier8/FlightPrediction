# syntax=docker/dockerfile:1

FROM gcr.io/spark-operator/spark:v3.1.1

ADD practicaBD /opt/spark-apps/practicaBD
ADD jars /opt/spark-apps/jars
#ADD spark-3.1.2-bin-hadoop3.2 /opt/spark
#COPY practicaBD/flight_prediction/target/scala-2.12/flight_prediction_2.12-0.1.jar /opt/spark/examples/jars/flight_prediction_2.12-0.1.jar
USER root
RUN chmod -R 777 /opt/spark-apps/jars
#WORKDIR /opt/spark-apps/practicaBD/flight_prediction

#COPY predictor-entrypoint.sh /bin/predictor-entrypoint.sh
#ENTRYPOINT ["predictor-entrypoint.sh"]
