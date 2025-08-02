# gcp-identity-platform-express-backend-demo

Demostración del uso de GCP Cloud Identity Platform para autenticarse, usar el proceso de auto registro o el pre registro de usuarios.

## Prerequisitos

1. Terner una cuenta en GCP (google cloud platform)
2. Crea una instancia de Identity Platform en un proyecto de GCP
3. Crea un tenant en Cloud Identity Platform
4. Deeberás crear un Service Account en GCP con con los siguientes roles:
   - roles/iam.serviceAccountUser
   - roles/identityplatform.admin
   - roles/logging.logWriter
5. Crear un Service account prive key (descarga el json)
6. Abre el service account prive key .json y asigna los valores a las variables de entorno en un archivo .env (debe estar en la raiz del proyecto)
   - project_id a variable GCP_PROJECT_ID
   - client_email a variable GCP_SA_CLIENT_EMAIL
   - private_key a variable GCP_SA_PRIVATE_KEY (deberas usar comillas dobles)
7. Obten el API Key de tu Identity Platform y asignalo a la variable GCP_IDENTITY_API_KEY (lo puedes obtener navegando al identity platform y busca el link Application setup details en la opcion providers)

## Como usar este demo

1. Clona el repositorio
2. Instala las dependencias de npm

```bash
npm install
```

3. Corre el codigo desde tu maquina local

```bash
npm run dev
```

## Ejemplos de uso

Registro de usuario (auto registro)

```bash
curl --location 'http://localhost:8080/api/signup' \
--header 'Content-Type: application/json' \
--data-raw '{"email":"email@gmail.com","password":"P4ssw0rd!","tenantId":"ide de tu tenant"}'
```

Pre Registro (Este asigna un password temporal y devuelve un link que deberia usarse en un email que le envies al usuario, con este link el puede habilitar su cuenta y establecer su password)

```bash
curl --location 'http://localhost:8080/api/pre-signup' \
--header 'Content-Type: application/json' \
--data-raw '{"email":"email@gmail.com","tenantId":"ide de tu tenant"}'
```

Iniciar sesion

```bash
curl --location 'http://localhost:8080/api/auth' \
--header 'Content-Type: application/json' \
--data-raw '{"email":"email@gmail.com","password":"P4ssw0rd!","tenantId":"tenantId":"ide de tu tenant"}'
```

**Nota** Una vez que el usuario inicie sesión correctamente se devolverá un token el cual deberia usar en el los recursos que requieren un usuario autenticado

Usar un recurso protegido el cual requiere que el usuario haya iniciado sesion (token requerido)

```bash
curl --location 'http://localhost:8080/api/profile' \
--header 'Authorization: ••••••'
```
