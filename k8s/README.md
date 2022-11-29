# Desplegar el escenario completo utilizando *Kubernetes*

El objetivo de esta mejora es conseguir levantar el escenario completo utilizando *k8s*, para lo cual se utiliza el *Servicio de Kubernetes* de Azure.

Los pasos seguidos han sido los siguientes:

- Se ha creado un *Deployment* y un *Service* de tipo *ClusterIP* para cada uno de los siguientes microservicios: *kafka*, *zookeeper* y *mongodb*.
- Se ha creado un *Deployment* y un *Service* de tipo *LoadBalancer* (para poder ser accedido desde fuera del clúster) para el microservicio *webapp*.
- Para desplegar la aplicación de predicción con *Spark* se utiliza el proyecto *Spark Operator*, que se instala en el clúster con ayuda de *Helm*. Una vez instalado, únicamente hay que crear un fichero *yaml* definiendo la aplicación y aplicarlo. Únicamente con eso se levantarán en el clúster los *drivers* y *executors* necesarios.

Una vez creados los ficheros *yaml* necesarios, se levanta un clúster de *k8s* y se ejecuta el siguiente comando para levantar el escenario (desde dentro de la carpeta donde se encuentren los ficheros):

```
kubectl apply -f .
```

Pasados unos segundos, podemos ver todos los recuros de *k8s* con el comando:

```
kubectl get all
```

Observando la salida del comando anterior se puede ver la dirección por la cual se puede acceder a la aplicación desplegada, que es la dirección IP externa asignada al servicio *webapp-srv*.
