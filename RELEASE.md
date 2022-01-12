# Release

## Release Process

Here is the high level process. See other sections of this page for details on how each step works.

1. Push git tag to GitHub repo.
2. Once Docker Hub has the new image, pull that image to your local machine and run `make tarball TAG=1.1.4` (use the correct tag). The resulting tarball will be named `pulsar-admin-console-$(TAG).tar.gz`.
3. Create the GitHub release page. Upload the tarball and make sure the release notes include the tarball's checksum and a reference to the docker image for the release. (The checksum is printed out as part of running `make tarball`.)

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
