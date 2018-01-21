# GitCheck

Input your github profile link to get a code style score

## Setup
```
npm install
pip install -r requirements.txt
```
Add database password to environment variables
On mac:
Run this in terminal OR add this to ```~/.bashrc```
```
export PENNAPPS_MONGO_PASSWORD="password_here"
```

On windows:
```
setx PENNAPPS_MONGO_PASSWORD password_here
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

