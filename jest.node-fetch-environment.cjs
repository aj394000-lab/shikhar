const NodeEnvironment = require('jest-environment-node').TestEnvironment;

module.exports = class NodeFetchEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.global.Request = globalThis.Request;
    this.global.Response = globalThis.Response;
    this.global.Headers = globalThis.Headers;
    this.global.FormData = globalThis.FormData;
    this.global.Blob = globalThis.Blob;
    this.global.crypto = globalThis.crypto;
    this.global.btoa = globalThis.btoa;
    this.global.atob = globalThis.atob;
  }
};
