FROM public.ecr.aws/lambda/python:3.9

ARG FUNCTION_DIR="/src"

ADD / ${FUNCTION_DIR}/

RUN pip3 install -r ${FUNCTION_DIR}/requirements.txt

WORKDIR ${FUNCTION_DIR}

CMD [ "main.handler" ]