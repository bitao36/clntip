# clntip
Web estática simple para recibir propinas usando el bolt11. Se conecta a un Core Lightning node usando lnsockets y commando. 
Commando antes de la versión 0.12 de core lightning era un plugin pero a partir de la versión 0.12 ya está dentro del core. Por eso te recomiendo instalar una versión de Core Lightning posterior a la 0.12. Si instalas una versión anterior debes activar el plugin cuando inicializes lightningd.

## ¿Cómo funciona commando?
Commando es un plugin creado por Rusty Russell que permite ejecutar comandos rpc nativos al nodo de Core Lightning a través de sockets. El método para autorizar la ejecución de determinado comando se hace a través de runes.

## ¿Como crear las runes?
Las runes las debes crear con el commando lightning-cli commando-rune y te lanzará el token que debes usar.
Para entender más acerca de runes te voy a dar el siguiente link para que le eches un vistazo:

[Documentación de Runes](https://github.com/rustyrussell/runes/tree/v0.3.1)


A continuación te voy a poner las tres runes con las que he hecho el ejemplo:

```gherkin=
lightning-cli commando-rune restrictions='["method=getinfo","rate=2"]'
lightning-cli commando-rune restrictions='["method=invoice","rate=30","pnamelabel^tip-"]'
lightning-cli commando-rune restrictions='["method=waitinvoice","pnamelabel^tip-"]'
```
## Consideraciones
Esta es la simplicidad en su máxima expresión, usamos una página HTML5 estática con JS Vanilla y con CSS.

Toda la magia ocurre cuando usamos js/lnsockets.js que a su vez usa este componente webassembly js/lnsockets.wasm 
 para efectuar la conexión con el socket que hemos indicado en core lightning.

Te voy a dejar el link para que le eches un ojo:

[lnsockets](https://github.com/jb55/lnsocket)

También puedes desplegar en node.js o Rust, pero quería mantener todo simple para dejar claro que para casos de uso no muy complejos se pueden crear soluciones simples sin complicarse mucho. 

Esta es la primer Lightning App que creo porque cuando me dí cuenta de lo poderoso que era poder ejecutar desde un cliente web comandos nativos directos a mi nodo Core Lightning y sin necesidad de usar un servidor web, ni pasar por protocolo ssl y tls, literalmente me voló la cabeza. Así que tenía que hacer algo simple pero funcional para poder experimentarlo en un caso de uso real.


## Agregar puerto del socket
En el archivo de configuración de Core Lightning debes añadir esta línea:

`experimental-websocket-port=8325`

## Clonar el repositorio

Debes estar en la carpeta de tu servidor en la que vayas a desplegar la página html y luego:

`$ git clone git@github.com:bitao36/clntip.git`

## Modificar el archivo tip.js
Debes editar el archivo tips.js para añadir los datos que están entre ángulos <>
Estos son ip,node_id,socket_port, y en cada método rpc añadir la rune correspondiente.

## Desplegar

Si estás probando en local debes asegurarte de tener cualquier servidor e ingresar en el navegador la url

`$ http://localhost/clntip`

Dado que esto es una página estática, puedes subir por ftp la carpeta a cualquier sitio que te permita desplegar páginas estáticas.

## Despedida

Espero que puedas experimentar el poder de commando y  tener el efecto wow que yo tuve cuando me funcionó este proyecto por primer vez. Saludos!

