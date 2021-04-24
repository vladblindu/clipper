## FTP DEPLOYMENT ACTIONS

### Usage

command clipper fda [pkg] -d dest

where:
- pkg is the name of the package to be deployed
- -d or --dest the ftp destination directory

### ! Don't forget:

The deployed package should have a **publicDir** specified as a key in it's package.json file, or else it won't be 
recognised as a frontend package. 
This package is intended for use in yarn workspaces environments. It expects a root package
that contains a **wsMap** key (see File System Actions README for reference).
if **pkg** is specified it will be sought for in the **wsMap** dictionary, else it will search for the closest
up-dir package.json, and will check that the package is registered in the **wsMap** dictionary.
