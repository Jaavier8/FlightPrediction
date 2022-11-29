# Desplegar el escenario completo en *Google Cloud*

El objetivo de esta mejora es conseguir levantar el escenario completo en *Google Cloud*. Para el despliegue en *Google Cloud* se ha optado por partir de la mejora de **docker-compose**. Una vez que tenemos creado el fichero *docker-compose.yml* creado, que levanta cada microservicio en un contenedor, se siguen los siguientes pasos:

- Levantamos una instancia *e2-medium* en la consola de *Google Cloud*, habilitando tráfico *http* y *https*.
- Accedemos a la consola de la instancia levantada e instalamos *git*, *docker* y *docker-compose*.
- Clonamos este repositorio.
- Modificamos el servicio *webapp* en el *docker-compose.yml* para que *mapee* el puerto 80 de la máquina (que es donde llegan las peticiones *http*) al puerto 5000 de la aplicación (que es donde se sirve en el contenedor).


En las capturas adjuntas se puede comprobar el correcto funcionamiento de la aplicación desplegada en *Google Cloud.*