# Descripción
 **Scrapper** es una pagina web creada para facilitar las compras tecnologicas que quiera realizar un usuario, extrae mediante un link la base de datos que almacena todos los productos que ofecen las grandes tiendas y se recopilan en un unico archivo `csv` donde se encontraran especificaciones como: Nombre del producto, la tienda donde se ofrece, el precio del producto, entre otros. De esta manera se facilita la comparacion de precios y el usuario no necesitará investigar de tienda en tienda lo que se quiera comprar.

# Instrucciones de Ejecución
**El backend y el frontend se ejecutan en terminales distintas**

1. En una terminal del tipo powershell ejecutar el siguiente comando:
´´´
python app.py
´´´
**No cierres esa ventana**

2. En otra terminal command prompt ejecutar:
´´´
npx tsc
´´´
De esta manera el dist se asegurara de tener los archivos correctos

3. En la sección donde se encuentran los archivos del proyecto y hacer click derecho sobre el archivo llamado:
´´´
index.html
´´´
Seleccionar la opción "Open with Live Server" y de esta manera seras redirigido al sitio web.

Si de esta forma no funciona, deberas de realizar nuevamente el paso 3 pero en lugar de seleccionar "Open ith Live Server", hacer click sobre "Reveal in File Explorer" y escoger el archivo cuyo nombre sea **"index"**, de esta manera te dirigiras al sitio web.

# Uso del sitio web
1. Abre la página principal.
2. Escribe el **nombre** o **categoria** del producto que te interesa (samsung, laptop, tv, apple, samrtwatch, etc.) en la barra de búsqueda.
3. Presiona Enter o haz click en la lupa.
4. El sitio consultará y mostrará una lista de productos con:
- El nombre del producto.
- Tienda donde se encuentra.
- Categoría.
- Precio.
- Rating.
- Codigo.
Tambien estara la opción de añadir a favoritos o comprar (actualmente inhabilitada ambas opciones).
5. Si no se encuentran coincidencias, mostrará un mensaje de aviso.

## Extras del sitio web
- Creamos una sección nombrada "Sobre Nosotros", que habla sobre los integrantes y las intenciones con las cuales fue creada la pagina.
- Se encuentra una sección no habilita de Favoritos, pero si el usuario selecciona esa opción sera dirigido a un error, donde podra volver al inicio.

### Integrantes
- Anais Diaz
- Cristian Gallardo
- Matías Salas
