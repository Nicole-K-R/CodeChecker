# CodeChecker

Input your github profile link to get a code style score

## Setup
```
npm install
pip install -r requirements.txt
```
## Running
```
node app.js
```
Open browser to ```http://localhost:7000```


### Docker instructions (optional)
Build:
```
docker build -t codechecker . --build-arg mongo_password=<password_here>
```
Run
```
docker run -t -p 7000:7000 codechecker
```
Stop
```
docker stop $(docker ps -a -q --filter ancestor=codechecker --format="{{.ID}}")
```

