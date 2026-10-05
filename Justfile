default:
    cd json-server && docker build -t fp/json-server .
    docker run -d --rm -p 8888:80 --name fp-json-server fp/json-server
    cd webprog && pnpm i
    cd webprog && pnpm run dev

init:
    cd json-server && docker build -t fp/json-server .
    cd webprog && docker build -t fp/vite .
    cd webprog && pnpm i

docker:
    cd json-server && docker build -t fp/json-server .
    docker run -d --rm -p 8888:80 --name fp-json-server fp/json-server
    cd webprog && docker build -t fp/vite .
    cd webprog && docker run -it --rm -v $(pwd):/app -p 8080:8080 --name vite fp/vite -c "pnpm i && pnpm run dev"

down:
    -docker stop fp-json-server
    -docker stop vite
    -docker rm -f fp-json-server
    -docker rm -f vite
    -docker rmi fp/json-server
    -docker rmi fp/vite
