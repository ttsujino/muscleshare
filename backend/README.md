# Backend of muscleshare app

## Getting started

1. Make sure that the docker daemon is runnning properly
2. Build a docker image
```
make build
```
3. Start the db container
```
make db
```
4. Create the database, run the migrations, and start the server
```
make dev
```

## How to use
1. Add data to the database
```bash
curl -X POST http://localhost:3000/post/new/87fa0f17-0272-e0dc-8338-86dad7e6fc9f \
  -F "content=test" \
  -F "image=@/Users/t0721/Desktop/muscleshare/backend/imgs/image-for-test-get-image.jpg"
```

2. Retrieve all data from the database
```bash
curl -X GET http://localhost:3000/posts
```

3. Delete data from the database
```bash
curl --request DELETE \
  --url http://localhost:3000/post/{image_id} \
  --header 'Content-Type: multipart/form-data' \
  --header 'User-Agent: insomnia/9.3.3' \
  --header 'boundary: ----WebKitFormBoundary7MA4YWxkTrZu0gW' \
```

## Handle SQL
1. Enter the docker container
```
docker exec -it backend_database_1 bash
```
2. 
```
psql -U admin -d ms_db
```