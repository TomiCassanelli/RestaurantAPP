# Ingenieria de Software III
## Trabajo Práctico Integrador: Requisitos y Validación

**Alumno:** Tomas Cassanelli  
**Clave UCC:** 2102092

---

* **Requisitos del Proyecto Integrador**:

  * **Aplicación Completa:** Utilicen una aplicación, ya sea desarrollada por ustedes o un proyecto existente en GitHub, que incluya:
    - [x] Un servicio de frontend.
    - [x] Un servicio de backend.
    - [x] Interacción con base(s) de datos.
    - [x] Repositorio en Git: La aplicación debe estar alojada en un repositorio público Git.
      - Repositorio Propio: https://github.com/TomiCassanelli/RestaurantAPP
      - Repositorio Original: https://github.com/CodAffection/Angular-7-Master-Detail-CRUD-with-Web-API
    - [x] La aplicación puede ser simple pero tengan en cuenta que deben poder realizarse varias pruebas tanto unitarias como de integración, por lo cual una app muy simple como un ABM no les va a servir.
    - [x] No hay ninguna restricción con respecto a tecnologías, pueden hacer o usar apps hechas con cualquier framework de front y de back, idem BD, puede ser cualquier motor.

  * **Build y Deploy Automatizados:** Configuren la construcción y el deploy de la aplicación de manera automatizada utilizando herramientas vistas en clase, como Azure Devops Pipelines o cualquiera que Uds conozcan.
    - [ ] Cada pull request aprobado a la rama master debe construir la aplicación automáticamente.
    - [ ] Deben ejecutar los tests de unidad, recolectar y mostrar los resultados.
    - [ ] Superados los test de unidad, el pipeline debe realizar el deploy automáticamente al entorno de QA ejecutando además pruebas de integración.
    - [ ] Debe existir una aprobación manual para aprobar el pase al entorno de Producción
    - [ ] Test Cases: Presenten los test cases escritos, incluyendo los tests de integración.
    - [ ] Deben haber 2 entornos: QA y PROD.
    - [ ] La forma del deploy puede ser contenedores o codigo compilado, pueden usar cualquier servicio (como Heroku) o nube para hacer el deploy.
    - [ ] El pipeline puede ser construido con cualquier herramienta de Devops o combinacion de ellas, por ejemplo pueden usar Jenkins para el Build y Octupus o GitHub actions para el deploy, o todo en Azure Devops o una mezcla o algo en GitLab. Uds deciden la(s) herramientas con las que se sientan más cómodos, se evaluará concepto, no herramienta.
   
  * **Validación**

    Para validar su proyecto, se realizará lo siguiente:

   * El profesor pedirá un pequeño cambio en el código para validar que:
     - [ ] Se corren las pruebas unitarias, se deberá visualizar un informe/reporte
     - [ ] Se corre correctamente el proceso automatizado de Build
     - [ ] Se corre correctamente el proceso automatizado de Deploy
     - [ ] La versión en QA refleja dicha modificación.
     - [ ] Se corren las pruebas de integración, se deberá visualizar un informe/reporte
     - [ ] Se realiza la aprobación manual para el pase al entorno de PROD.

  * El profesor pedirá un pedirá un pequeño cambio en un test unitario para validar que:
    - [ ] El fallo de un test unitario aborta el proceso automatizado de Build y pasos subsiguientes.
    - [ ] El fallo de un test de integración aborta el proceso automatizado de Depoly y pasos subsiguientes.

Asegúrense de cumplir con todos los requisitos y procedimientos establecidos para asegurar una evaluación satisfactoria. Preparen la presentación del trabajo antes del final. Cualquier mejora o agregado se tendrá en cuenta para la nota final del proyecto.
