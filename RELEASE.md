# Release

## How to build a Docker release image

Docker release image is built by the automated Docker Hub build process. The build is triggered by Github remote tagging.

Here is an example how to tag and push to `origin` that will automatically trigger a Docker Hub build.

### Tag Requirements
1. The tag has to conform the regex `^[0-9.]+`. It's recommended to follow major.minor.patch pattern in decimal format.
2. Release should be tagged on the `master` branch
3. Release tag must be incremented.

### Tag and Push to remote
Tag and push to the remote `origin` will trigger a Docker Hub build.

Tag the HEAD commit
```
$ git tag 1.0.0
```
Or tag a specific commit.
```
$ git tag 1.0.0 <commit sha>
```

Push to the remote. In this case, `origin` is the remote.
```
$ git push origin 1.0.0
```
