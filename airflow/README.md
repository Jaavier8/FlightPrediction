# Desplegar el escenario completo en *Google Cloud*

El objetivo de esta mejora es entrenar el modelo utilizando *Apache Airflow*.

En el repositorio de la práctica ya viene definido el DAG, que es, básicamente, una colección de tareas organizadas y relacionadas, que se ejecutan en un orden concreto dependiendo del estado de su predecesora.

Antes de levantar *Airflow* hay que instalar *sqlite3*, y una vez instalado, ejecutar el siguiente comando para preparar el escenario:

```
airflow db init
```

Posteriormente levantamos el *webserver* y el *scheduler*, y una vez levantados (es importante que el comando EXPORT de AIRFLOW_HOME se ejeute en ambos terminales, tanto en el del *webserver*, como en del *scheduler*), hay que ejecutar el DAG para entrenar el modelo, para ello buscamos en la documentación de *Airflow* y se siguen los siguientes pasos:

- Copiar el DAG (*setup.py*) a la ruta AIRFLOW_HOME/dags. Una vez hecho esto, podemos ver el DAG en la interfaz gráfica.
- Lanzamos el siguiente comando para ejecutar el DAG y entrenar el modelo:

```
airflow dags trigger agile_data_science_batch_prediction_model_training
```

El DAG está configurado para ejecutar el comando *spark-submit*, lo cual no funcionará si no podemos ejecutar ese comando desde cualquier carpeta del sistema. Para solucionar este problema existen dos soluciones:

- Cambiar *spark-submit* en el DAG por la ruta completa donde tenemos instalado *Spark*.
- Añadir la ruta de *Spark* en el PATH. Una forma sencilla es la siguiente:

```
export PATH=$PATH:<ruta-spark>
```

En el DAG podemos ver que, en la línea 63 se le pasa el atributo dag al *BashOperator*. El DAG tiene los argumentos por defecto. Como se puede ver en la línea 12, si falla se reintenta hasta 3 veces, y lo hace cada 5 minutos.

Si todo funciona correctamente podremos verlo en la interfaz gráfica, además de poder comprobar en la carpeta *models* que los ficheros se han actualizado mirando su hora de creación.


En las capturas adjuntas se puede comprobar el correcto funcionamiento y el proceso seguido por el DAG durante el entrenamiento.