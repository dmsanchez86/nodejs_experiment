*Pasos Para el Manejo de Mongo DB con mongoose y mongod*

```bash
# Primero Iniciamos el servidor de mongo
# Con el siguiente comando
mongod

# Luego en otra terminal correr el cliente de mongo
mongo

# seleccionamos la base de datos
use [myDatabase]

# mostramos las colecciones de la base de datos o tablas
show collections

# para ver los datos de una tabla o un modelos
db.myTable.find() # para ver los datos
db.myTable.find().pretty() # para verlos ordenados en formato json

```