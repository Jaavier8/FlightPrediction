# Dockerizar servicios y levantar el escenario con *docker-compose*

El objetivo es conseguir el funcionamiento de la aplicación completa levantando cada uno de los microservicios en un contenedor **Docker**.

Para cada uno de los microservicios que se requiere la creación de una imagen propia se crea un directorio, que son los siguientes:

- **webapp.** Para la creación de la imagen de la aplicación *Flask.*
- **predictor.** Para compilar la aplicación *Scala* y crear el fichero *jar* necesario para ejecutar la aplicación con el comando *spark-submit*.

El fichero *docker-compose.yml* contiene la definición de todos los servicios. Para levantar el escenario completo, ejecute los siguientes comandos:

```
docker-compose build
docker-compose up
```

Pasados unos tres minutos, cuando todos los servicios hayan terminado de levantarse, se puede acceder a [http://localhost:5000/flights/delays/predict_kafka](http://localhost:5000/flights/delays/predict_kafka) y probar el correcto funcionamiento de la aplicación.
