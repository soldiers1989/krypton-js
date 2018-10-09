---
id: basic_privnet
title: Basic - Using a Private Net
---

This article describes the necessary setup required in order to use `krypton-js` on a private net.

A private net is defined as a private instance of the KAZE blockchain. It can be running either locally or on the cloud depending on your needs. It is useful for development work as it gives the developer all the STREAM and KAZE needed without having to beg and steal.

## Infrastructure

As `krypton-js` is a light wallet SDK, there are several pieces of infrastructure that should be in place in order for `krypton-js` to be effective.

First, the private chain must be running and its RPC ports be open. The RPC ports are usually configured to be 22886 or 44886 depending on whether you are running a main net or test net configuration. If using HTTPS, the ports are usually 22885 or 44885. Do test this by doing a simple curl towards your private network:

```sh
curl \
-H "Content-Type: application/json" \
-X POST \
-d '{"jsonrpc":"2.0","id":"123","method":"getversion","params":[]}' \
http://localhost:22886
```
If the KAZE node is listening to that port, you should get something like:

```sh
{"jsonrpc":"2.0","id":"123","result":{"port":22886,"nonce":771124497,"useragent":"\/KAZE:2.7.3\/"}}
```

Next, we need a data provider that can help aggregate the blockchain and provide us with the necessary information with a single API call. This is important as KAZE uses the UTXO system for its native assets. This means that we need the references to every single transaction output that we have received in order to spend it.

Currently, this service is available as either krypton-wallet-db or kazescan. Once this is setup, do check that your service is available through a curl request too as `krypton-js` will be using HTTP requests to retrieve the data.

## Adding the private net

Now that all this is done, we will prepare our `Network` class that will configure and inform `krypton-js` about our private net. First, we create the following javascript object:

```js
const config = {
  name: 'PrivateNet',
  extra: {
    kazescan: 'http://localhost:4000/api/main_net'
  }
}
```
For this example, we have a kazescan service setup serving our private net. The `name` field will be the name which we reference this in `krypton-js`.

Now, we construct the `Network` object and add it to our `networks`:

```js
const privateNet = new rpc.Network(config)
Krypton.add.network(privateNet)

Krypton.api.kazescan.getBalance('PrivateNet', address)
.then(res => console.log(res))
```

We should be able to see a printout of the balance of the address if it is successful.

## Notes

- If you are using docker to host everything (for example, relying on kazescan docker), the urls from `getRPCEndpoint` will not be reliable as they are local urls.
- You might want to setup a startup script that imports `krypton-js` and imports the network in.
