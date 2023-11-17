CONTAINER_NAME="container_parcial_db"

# Verificar si el contenedor existe
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
    # Detener y eliminar el contenedor existente
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
    echo "Contenedor '$CONTAINER_NAME' existente eliminado."
fi

# Construir contenedor nuevamente y ejecutarlo
echo "Creando contenedor de Postgres"
docker build -t image_parcial_db .
echo "Ejecutando contenedor de Postgres"
docker run --name container_parcial_db -p 5432:5432 image_parcial_db