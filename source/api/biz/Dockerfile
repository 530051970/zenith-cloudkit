FROM public.ecr.aws/lambda/python:3.9

ARG FUNCTION_DIR="/app"

ADD / ${FUNCTION_DIR}/

RUN pip3 --timeout=1000 install -r ${FUNCTION_DIR}/requirements.txt

WORKDIR ${FUNCTION_DIR}

EXPOSE 80

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]