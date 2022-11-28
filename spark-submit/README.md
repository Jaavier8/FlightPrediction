# Ejecución del *job* de predicción con Spark Submit

El objetivo es conseguir el funcionamiento del *job* de predicción ejecutándolo con el comando **spark-submit** en lugar de ejecutarlo en IntelliJ.

Como se puede ver en el fichero *command.txt*, el comando a ejecutar es el siguiente:

```
spark-submit \
--master local \
--deploy-mode client \
--class es.upm.dit.ging.predictor.MakePrediction \
--name FlightPrediction \
--packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1,org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2 \
/home/javier/Escritorio/BDFI/ProyectoFinal/practica_big_data_2019/flight_prediction/target/scala-2.12/flight_prediction_2.12-0.1.jar
```

Como la ejecución es en local, se indica que el *master* es *local* y que el modo de despliegue (*deploy-mode*) es en cliente. Posteriormente, se pasa la clase que se va a ejecutar (*class*), así como el nombre de la aplicación. Seguidamente, los paquetes necesarios para el correcto funcionamiento (*packages*). Por último, el fichero *jar* que contiene el programa.

Como no se dispone del fichero *jar*, hay que generarlo, para lo que se utiliza la herramienta **sbt**. Una vez instalada, y dentro de la carpeta que contiene la aplicación de predicción de vuelos (*flight_prediction*), ejecutamos los siguientes comandos:

```
sbt compile
sbt package
```

Los comandos anteriores generan el *jar* de la aplicación, con lo que ya se podría el comando **spark-submit**.