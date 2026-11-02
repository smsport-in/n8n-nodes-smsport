const assert = require('assert');

// 1. Verify Credential class
const { SmsPortApi } = require('../dist/credentials/SmsPortApi.credentials.js');
const cred = new SmsPortApi();
assert.strictEqual(cred.name, 'smsPortApi');
assert.strictEqual(cred.displayName, 'SMSPort API');
assert(cred.properties.some((p) => p.name === 'apiKey'));
assert(cred.properties.some((p) => p.name === 'baseUrl'));
assert(cred.test.request.url === '/ping');
console.log('✔ Credential definition is valid');

// 2. Verify Main Node class
const { SmsPort } = require('../dist/nodes/SmsPort/SmsPort.node.js');
const node = new SmsPort();
assert.strictEqual(node.description.name, 'smsPort');
assert.strictEqual(node.description.displayName, 'SMSPort');
assert(node.description.credentials.some((c) => c.name === 'smsPortApi'));
assert(node.description.properties.some((p) => p.name === 'resource'));
assert(typeof node.methods.loadOptions.getSenders === 'function');
assert(typeof node.methods.loadOptions.getTemplates === 'function');
assert(typeof node.execute === 'function');
console.log('✔ SmsPort node definition is valid');

// 3. Verify Trigger Node class
const { SmsPortTrigger } = require('../dist/nodes/SmsPortTrigger/SmsPortTrigger.node.js');
const trigger = new SmsPortTrigger();
assert.strictEqual(trigger.description.name, 'smsPortTrigger');
assert.strictEqual(trigger.description.displayName, 'SMSPort Trigger');
assert(trigger.description.webhooks.some((w) => w.name === 'default'));
assert(typeof trigger.webhook === 'function');
console.log('✔ SmsPortTrigger node definition is valid');

console.log('\nAll n8n integration smoke tests passed successfully!');
