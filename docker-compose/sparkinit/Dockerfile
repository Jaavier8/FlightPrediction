# syntax=docker/dockerfile:1

FROM bitnami/spark:3.1.2-debian-10-r130

COPY predictor-entrypoint.sh /bin/predictor-entrypoint.sh
ENTRYPOINT ["predictor-entrypoint.sh"]
