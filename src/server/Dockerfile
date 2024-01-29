# build stage
FROM maven:3.9-amazoncorretto-20 AS build
WORKDIR /app

COPY . .

RUN mvn clean package -DwarName=server

# run stage
FROM tomcat:10.1.12-jre17


COPY --from=build /app/target/*.war $CATALINA_HOME/webapps/