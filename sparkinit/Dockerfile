# syntax=docker/dockerfile:1

FROM docker.io/bitnami/spark:3.1.2

CMD sleep 10
CMD spark-submit --master spark://spark:7077 --deploy-mode cluster --class es.upm.dit.ging.predictor.MakePrediction --name FlightPrediction --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1,org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2 ../../spark-apps/flight_prediction_2.12-0.1.jar
