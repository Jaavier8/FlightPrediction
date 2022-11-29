#!/bin/sh
sleep 15
spark-submit --conf spark.jars.ivy=/opt/bitnami/spark/ivy --master spark://spark:7077 --deploy-mode cluster --supervise --class es.upm.dit.ging.predictor.MakePrediction --name FlightPrediction --packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1,org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2 /opt/spark-apps/practicaBD/flight_prediction/target/scala-2.12/flight_prediction_2.12-0.1.jar