# Instrukcja

## Dockerfiles
Będziemy używać 3 serwisów - frontendu, backendu oraz bazy danych. Każdy z nich będzie potrzebował swojego własnego obrazu, przygotowywanego poprzez Dockerfile a później `docker build` (np. dla obrazu postgresa: `docker build -t dainalfek/postgres .`). Jest to szczególnie ważne w przypadku deployowania na chmurę - nie możemy w tym przypadku użyć `build` w `docker-compose.yml`, ponieważ nie jest on obsługiwany. Należy podać gotowy obraz, który uprzednio należy umieścić na DockerHub - w tym celu w tworzymy w DockerHub odpowiednie repozytoria, tworzymy obrazy o tej samej nazwie i poprzez Docker Desktop wypychamy obraz.

### Baza danych

Dockerfile dla bazy danych jest bardzo prosty:

```dockerfile
FROM postgres:15.0-alpine
COPY ./init.sql /docker-entrypoint-initdb.d/10-init.sql
```

jedyne co robimy to zaciągamy z internetu obraz bazy postgres oraz kopiujemy na obraz plik `./init.sql` z maszyny lokalnej do folderu `/docker-entrypoint-initdb.d/`, aby został on wykorzystany do inicjalizacji bazy.

### Backend

Dockerfile dla backendu zawiera nieco więcej informacji:

```dockerfile
FROM node:18.12.0-alpine

WORKDIR /backend
COPY package*.json .
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
```

Tu również kopiujemy obraz z internetu, tworzymy working directory z którego będą uruchamiane pozostałe komendy. Kopiujemy najpierw tylko pliki potrzebne do wykonania komendy `npm install`, dzięki czemu przy kolejnych próbach budowania obrazu, jeżeli pliki te się nie zmieniły, pozwoli to na wykorzystanie warstw Dockera zapisanych w pamięci. Następnie kopiujemy cały kontent naszego lokalnego folderu do folderu `/backend` w naszym obrazie, po czym informujemy Dockera że kontener będzie nasłuchiwał na porcie 3000. Komenda `CMD` określa komendy do wykonania przy uruchamianiu kontenera - w tym wypadku będzie to `npm run dev`.

### Frontend

Frontend również jest oparty na node, co sprawia że Dockerfile wygląda bardzo podobnie:

```dockerfile
FROM node:18.12.0-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install -g node-gyp
RUN npm install -g @angular/cli
COPY . .
EXPOSE 4200
```

Robimy w zasadzie to samo.

## Docker-compose

```yaml
version: '3.8'
services:
  db:
    image: dainalfek/postgres:latest
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=postgres
    # volumes: 
    #   - ./db:/var/lib/postgresql/data
  backend:
    image: dainalfek/tic-tac-toe_backend:latest
    restart: always
    # build:
    #   context: ./backend
    #   dockerfile: Dockerfile
    ports:
      - "3000:3000"
    # volumes:
    #   - "./backend:/backend"
    depends_on:
      - db
    environment:
      - DB_USER=postgres
      - DB_PASSWORD=password
      - DB_NAME=postgres
      - DB_HOST=db
      - DB_PORT=5432
  frontend:
    image: dainalfek/tic-tac-toe_frontend:latest
    restart: always
    # build:
    #   context: ./frontend
    #   dockerfile: Dockerfile
    ports:
      - "4200:4200"
    # volumes:
    #   - ./frontend:/app
    command: npm start
```

W docker compose deklarujemy stworzenie trzech serwisów: `db`, `backend` oraz `frontend`. Deklarujemy image, z którego będziemy korzystać (budowaliśmy go za pomocą poprzednio opisanych Dockerfile). Ten krok można by było pominąć i wykorzystać atrybut `build`, jak zresztą wskazuje kod w komentarzach - niestety, nie można wykorzystać tego atrybutu przy korzystaniu z AWS i musimy mieć już zbudowane obrazy. Atrybut `restart` pozwala na automatyczne startowanie kontenerów, nie jest on jednak obsługiwany przez AWS (mógł jednak zostać w pliku, jest zwyczajnie pomijany). Atrybut `environment` służy do zdefiniowania zmiennych środowiskowych. Atrybut `command` działa podobnie do `CMD` z pliku Dockerfile. `volumes` pozwalają nam na synchronizację folderów lokalnych z tymi w kontenerach, jednakże nie jest to obsługiwane przez AWS. `ports` określa mapowanie portów na maszynie lokalnej do portów z naszych serwisów.

## AWS

Należy utworzyć nowy `docker context`:

```
docker context create ecs myecscontext
```

Musimy utworzyć swoje własne dane uwierzytelniające (Your security credentials -> Access Keys) i je wprowadzić. Następnie używamy kontekstu i stawiamy serwisy:

```
docker context use myecscontext
docker compose up
```
