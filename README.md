# dd3

## Introduccion
El desarrollo se hizo el nodejs, se utilizo TypeORM para conectarse a la base de datos que se creo con PostgresSQL.
Para inicializar el proyecto debe realizar los siguientes pasos:

1. Copiar archivo `.env_example`, `cp .env_example .env` y modificar su contenido con los datos correctos de la base de datos
2. Correr el comando `npm i` para instalar las dependencias utilizadas
3. Correr las migraciones de base de datos con el comando `npm run migration`
4. Iniciar el servidor con el comando `npm start`

## Rutas
### /user/login
Ruta para realizar inicio de sesion, los datos que se solicitan son `email` y `password`:
```
{
  "email": "prueba@example.com",
  "password": "123"
}
```
Como respuesta retornara un JSON con el Token de sesion del usuario.
```
{
  "login": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqdWFucGlzMkBleGFtcGxlLmNvbSIsImlhdCI6MTY1NzM1MDE2NiwiZXhwIjoxNjU3NDM2NTY2fQ.IVulKeKXSnTWgkcvrLmz3AvHNBvJ_styp7QGpEGsiIg"
}
```
### /user/signup
Ruta para crear un nuevo usuario, los datos que se solicitan son `name`, `email`, `password` y `passwordRepeat`:
```
{
  "name": "prueba",
  "email": "prueba@example.com",
  "password": "123",
  "passwordRepeat": "123"
}
```
Como respuesta retornara un JSON con el Token de sesion del usuario.
```
{
  "login": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqdWFucGlzMkBleGFtcGxlLmNvbSIsImlhdCI6MTY1NzM1MDE2NiwiZXhwIjoxNjU3NDM2NTY2fQ.IVulKeKXSnTWgkcvrLmz3AvHNBvJ_styp7QGpEGsiIg"
}
```
### /attempt/new
Ruta para crear un nuevo intento, generara una nueva palabra para que los usuarios la adivinen, esta palabra no se repetira y cada vez que se genere una nueva todos los usuarios intentaran adivinar la nueva palabra, el dato que se solicita es `token`, para autentica al usuario.
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqdWFucGlzMkBleGFtcGxlLmNvbSIsImlhdCI6MTY1NzM1MDE2NiwiZXhwIjoxNjU3NDM2NTY2fQ.IVulKeKXSnTWgkcvrLmz3AvHNBvJ_styp7QGpEGsiIg"
}
```
Como respuesta retornara un JSON notificando si se creo exitosamente el nuevo intento.
```
{
  "created": true
}
```
### /attempt/word
Ruta para validar la palabra escrita por el usuario, esta palabra debe contener 5 letras, solo permitira 5 intentos y despues bloqueara el ingreso de mas palabras y tambien validara que no haya descubierto la palabra. los datos que se solicitan son `word` y `token`.
```
{
  "word": "gatos",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqdWFucGlzMkBleGFtcGxlLmNvbSIsImlhdCI6MTY1NzM1MDE2NiwiZXhwIjoxNjU3NDM2NTY2fQ.IVulKeKXSnTWgkcvrLmz3AvHNBvJ_styp7QGpEGsiIg"
}
```
Como respuesta retornara un JSON validando cada una de las letras si coincide con la palabra del intento, cada letra contara con un valor que sera **1** si la letra esta en la misma posicion en las dos palabras, **2** si la letra del usuario esta en la palabra a encontrar pero en una posicion diferente y **3** si la letra del usuario no esta en la palabra a encontrar.
```
[
    {
        "letter": "g",
        "value": 3
    },
    {
        "letter": "a",
        "value": 2
    },
    {
        "letter": "t",
        "value": 3
    },
    {
        "letter": "o",
        "value": 3
    },
    {
        "letter": "s",
        "value": 3
    }
]
```
### /analytics/user-attempts
Ruta para obtener las partidas que ha realizado un usuario y cuantas de estas partidas ha ganado, los datos que se solicitan son `userId` y `token`.
```
{
  "userId": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqdWFucGlzQGV4YW1wbGUuY29tIiwiaWF0IjoxNjU3MzQwMzk2LCJleHAiOjE2NTc0MjY3OTZ9.W9k0JyUORcyyH4qUoi1mxGe8UDOrSGbghFaN5WKBgN0"
}
```
Como respuesta retornara un JSON con la cantidad de partidas y cuantas de estas ha ganado:
```
{
  "attempts": 6,
  "wins": 4
}
```
### /analytics/ranking
Ruta para obtener los 10 jugadores que mas han ganado partidas, el dato que se solicita es `token`.
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqdWFucGlzQGV4YW1wbGUuY29tIiwiaWF0IjoxNjU3MzQwMzk2LCJleHAiOjE2NTc0MjY3OTZ9.W9k0JyUORcyyH4qUoi1mxGe8UDOrSGbghFaN5WKBgN0"
}
```
Como respuesta retornara un JSON con los 10 usuarios que mas han ganado, muestra su correo y la cantidad de partidas que han ganado:
```
[
    {
        "email": "juanpis@example.com",
        "wins": "4"
    },
    {
        "email": "juanpis2@example.com",
        "wins": "3"
    },
    {
        "email": "juanpis2@example.com",
        "wins": "1"
    }
]
```
### /analytics/words-corrects
Ruta para obtener las palabras que mas se han descubierto, el dato que se solicita es `token`.
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqdWFucGlzQGV4YW1wbGUuY29tIiwiaWF0IjoxNjU3MzQwMzk2LCJleHAiOjE2NTc0MjY3OTZ9.W9k0JyUORcyyH4qUoi1mxGe8UDOrSGbghFaN5WKBgN0"
}
```
Como respuesta retornara un JSON con todas las palabras que mas se han descubierto, muestra la palabra y al cantidad de veces que fue descubierta:
```
[
    {
        "word": "itero",
        "wins": "7"
    },
    {
        "word": "pozal",
        "wins": "1"
    }
]
```
