default:
    cd json-server && docker build -t fp/json-server .
    docker run -d --rm -p 8888:80 --name fp-json-server fp/json-server
    cd webprog && pnpm i
    cd webprog && pnpm run dev

docker:
    cd json-server && docker build -t fp/json-server .
    docker run -d --rm -p 8888:80 --name fp-json-server fp/json-server
    cd webprog && docker build -t fp/vite .
    cd webprog && docker run -it --rm -v $(pwd):/app -p 8080:8080 --name vite fp/vite -c "pnpm i && pnpm run dev"

stop:
    -docker stop fp-json-server
    -docker stop vite
    -docker rmi fp/json-server
    -docker rmi fp/vite