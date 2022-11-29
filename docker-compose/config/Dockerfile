FROM ubuntu

RUN apt update && apt upgrade -y
RUN apt install -y wget git curl python3-pip
RUN apt-get install -y openjdk-8-jdk

RUN wget https://archive.apache.org/dist/spark/spark-3.1.2/spark-3.1.2-bin-hadoop3.2.tgz
RUN tar -xvzf spark-3.1.2-bin-hadoop3.2.tgz
RUN mv spark-3.1.2-bin-hadoop3.2 /opt/spark
RUN rm spark-3.1.2-bin-hadoop3.2.tgz

ENV SPARK_HOME=/opt/spark
ENV JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64

RUN mkdir -p /opt/spark-apps
RUN git clone https://github.com/ging/practica_big_data_2019
RUN mv practica_big_data_2019 /opt/spark-apps/practicaBD
WORKDIR /opt/spark-apps/practicaBD

RUN pip install -r requirements.txt
RUN resources/download_data.sh
RUN python3 resources/train_spark_mllib_model.py .

RUN echo "deb https://repo.scala-sbt.org/scalasbt/debian all main" | tee /etc/apt/sources.list.d/sbt.list
RUN echo "deb https://repo.scala-sbt.org/scalasbt/debian /" | tee /etc/apt/sources.list.d/sbt_old.list
RUN curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | apt-key add
RUN apt update
RUN apt-get install -y sbt

WORKDIR /opt/spark-apps/practicaBD/flight_prediction

RUN sed -i 's/local\[\*\]/spark:\/\/spark:7077/g' src/main/scala/es/upm/dit/ging/predictor/MakePrediction.scala
RUN sed -i 's/localhost:9092/kafka:9092/g' src/main/scala/es/upm/dit/ging/predictor/MakePrediction.scala
RUN sed -i 's/127\.0\.0\.1:27017/admin:password@mongodb:27017/g' src/main/scala/es/upm/dit/ging/predictor/MakePrediction.scala
RUN sed -i 's/flight_delay_classification_response/flight_delay_classification_response?authSource=admin/g' src/main/scala/es/upm/dit/ging/predictor/MakePrediction.scala
RUN sed -i 's/\/Users\/admin\/IdeaProjects\/ging\/practica_big_data_2019/\/opt\/spark-apps\/practicaBD/g' src/main/scala/es/upm/dit/ging/predictor/MakePrediction.scala

RUN sbt compile
RUN sbt package

#COPY init-entrypoint.sh /bin/init-entrypoint.sh
#ENTRYPOINT ["bash", "init-entrypoint.sh"]
