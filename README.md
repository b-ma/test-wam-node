# Notes

The `postinstall` automatically copy the `sdk` directory to its right place:

```sh
cp -R node_modules/wam-community/dist/plugins/wimmics/utils/sdk node_modules/wam-community/dist/plugins/wimmics/utils/sdk-parammgr/src/
```

Run with

```sh
node index.js
```