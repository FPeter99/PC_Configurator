default:
    cd json-server && docker build -t fp/json-server .
    docker run -d --rm -p 8888:80 --name fp-json-server fp/json-server
    cd webprog && pnpm i
    cd webprog && pnpm run dev

stop:
    -docker stop fp-json-server
    -docker rmi fp/json-server