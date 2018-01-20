# CodeChecker

Input your github profile link to get a code style score


## Docker instructions
Build:
```
docker build -t codechecker . --build-arg mongo_password=<password_here>
```
Run
```
docker run -t -p 7000:7000 codechecker
```

