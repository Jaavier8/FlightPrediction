# Predicción de vuelos (Trabajo final BDFI)
En este repositorio se encuentra el código necesario para ejecutar la aplicación de predicción de vuelos con las distintas mejoras implementadas. Para cada una de las mejoras se ha creado un nuevo directorio, dentro del cual se encuentran las instrucciones necesarias para ejecutarlo.

A continuación se muestra un resumen del contenido de cada uno de los directorios.

## spark-submit

Contiene un fichero de texto con el comando **spark-submit** a ejecutar para levantar el *job* de predicción.

## docker-compose

Contiene el fichero *docker-compose.yml* necesario para levantar el escenario completo con **Docker**, así como una carpetas por cada microservicio que requiere la construcción de una imagen propia, la cual contiene el *Dockerfile* para construir dicha imagen.

## gcloud

Contiene evidencias del despliegue de la aplicación en **Google Cloud** y de su correcto funcionamiento.

## k8s

Contiene los distintos ficheros *.yaml* necesrios para desplegar la aplicación utilizando **Kubernetes**.

## airflow

Contiene evidencias del entrenamiento del modelo utilizando **Apache Airflow**.
