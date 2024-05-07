
FROM public.ecr.aws/docker/library/node:14.21.2 AS builder
COPY . /tmp/frontend/
RUN cd /tmp/frontend/ && npm install && npm run build


FROM public.ecr.aws/docker/library/nginx:1.23-alpine
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.6.0 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=builder /tmp/frontend/build/ /usr/share/nginx/public/
COPY nginx-config/ /etc/nginx/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]