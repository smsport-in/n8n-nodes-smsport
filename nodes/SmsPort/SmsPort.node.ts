import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  IHttpRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { messageFields, messageOperations } from './descriptions/MessageDescription';
import { templateFields, templateOperations } from './descriptions/TemplateDescription';
import { contactFields, contactOperations } from './descriptions/ContactDescription';

export class SmsPort implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'SMSPort',
    name: 'smsPort',
    icon: 'file:smsport-logo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Send WhatsApp messages, templates, and manage contacts via SMSPort WhatsApp Cloud API',
    defaults: {
      name: 'SMSPort',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'smsPortApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Message',
            value: 'message',
            description: 'Send text, media, or interactive WhatsApp messages',
          },
          {
            name: 'Template',
            value: 'template',
            description: 'Send Meta approved WhatsApp template messages',
          },
          {
            name: 'Contact',
            value: 'contact',
            description: 'Create, update, or search contacts in SMSPort',
          },
        ],
        default: 'message',
      },
      ...messageOperations,
      ...messageFields,
      ...templateOperations,
      ...templateFields,
      ...contactOperations,
      ...contactFields,
    ],
  };

  methods = {
    loadOptions: {
      /**
       * Dynamically fetch verified WhatsApp phone numbers for the current tenant.
       */
      async getSenders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const credentials = await this.getCredentials('smsPortApi');
        const baseUrl = (credentials.baseUrl as string) || 'https://api.smsport.in/api/v1';

        const options: IHttpRequestOptions = {
          method: 'GET',
          url: `${baseUrl.replace(/\/+$/, '')}/senders`,
          headers: {
            Authorization: `ApiKey ${credentials.apiKey}`,
            'X-API-Key': credentials.apiKey as string,
          },
          json: true,
        };

        try {
          const response = await this.helpers.httpRequest(options);
          const senders = response.senders || response.data || (Array.isArray(response) ? response : []);

          return senders.map((sender: { id: string; phoneNumber?: string; phoneE164?: string; displayName?: string; name?: string }) => {
            const phone = sender.phoneE164 || sender.phoneNumber || sender.id;
            const label = sender.displayName || sender.name || phone;
            return {
              name: `${label} (${phone})`,
              value: sender.id,
            };
          });
        } catch (error) {
          throw new NodeApiError(this.getNode(), error as JsonObject);
        }
      },

      /**
       * Dynamically fetch approved Meta WhatsApp templates for the current tenant.
       */
      async getTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const credentials = await this.getCredentials('smsPortApi');
        const baseUrl = (credentials.baseUrl as string) || 'https://api.smsport.in/api/v1';

        const options: IHttpRequestOptions = {
          method: 'GET',
          url: `${baseUrl.replace(/\/+$/, '')}/templates`,
          headers: {
            Authorization: `ApiKey ${credentials.apiKey}`,
            'X-API-Key': credentials.apiKey as string,
          },
          json: true,
        };

        try {
          const response = await this.helpers.httpRequest(options);
          const templates = response.templates || response.data || (Array.isArray(response) ? response : []);

          return templates.map((template: { name: string; language?: string; category?: string; status?: string }) => {
            const lang = template.language || 'en';
            const cat = template.category ? ` [${template.category}]` : '';
            return {
              name: `${template.name} (${lang})${cat}`,
              value: template.name,
            };
          });
        } catch (error) {
          throw new NodeApiError(this.getNode(), error as JsonObject);
        }
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('smsPortApi');
    const baseUrl = ((credentials.baseUrl as string) || 'https://api.smsport.in/api/v1').replace(/\/+$/, '');

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: unknown;

        // ─── 1. MESSAGE RESOURCE ───────────────────────────────────────────
        if (resource === 'message' && operation === 'send') {
          const senderId = this.getNodeParameter('senderId', i) as string;
          const recipientPhone = this.getNodeParameter('recipientPhone', i) as string;
          const messageType = this.getNodeParameter('messageType', i) as string;

          const payload: Record<string, unknown> = {
            senderId,
            to: recipientPhone,
            type: messageType,
          };

          if (messageType === 'text') {
            payload.text = this.getNodeParameter('messageText', i) as string;
          } else if (messageType === 'image') {
            payload.mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
            const caption = this.getNodeParameter('caption', i, '') as string;
            if (caption) payload.caption = caption;
          } else if (messageType === 'document') {
            payload.mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
            const caption = this.getNodeParameter('caption', i, '') as string;
            const fileName = this.getNodeParameter('fileName', i, '') as string;
            if (caption) payload.caption = caption;
            if (fileName) payload.fileName = fileName;
          } else if (messageType === 'interactive_button') {
            payload.text = this.getNodeParameter('messageText', i) as string;
            const buttonsData = this.getNodeParameter('buttons', i, {}) as {
              buttonValues?: Array<{ id: string; title: string }>;
            };
            const buttons = buttonsData.buttonValues || [];
            if (!buttons.length) {
              throw new NodeOperationError(this.getNode(), 'Please provide at least 1 button for interactive reply buttons', { itemIndex: i });
            }
            payload.buttons = buttons.slice(0, 3).map((b) => ({
              id: b.id.trim(),
              title: b.title.trim().slice(0, 20),
            }));
          }

          const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: `${baseUrl}/messages/direct-send`,
            headers: {
              Authorization: `ApiKey ${credentials.apiKey}`,
              'X-API-Key': credentials.apiKey as string,
            },
            body: payload,
            json: true,
          };

          responseData = await this.helpers.httpRequest(requestOptions);
        }

        // ─── 2. TEMPLATE RESOURCE ──────────────────────────────────────────
        else if (resource === 'template' && operation === 'send') {
          const senderId = this.getNodeParameter('senderId', i) as string;
          const recipientPhone = this.getNodeParameter('recipientPhone', i) as string;
          const templateName = this.getNodeParameter('templateName', i) as string;
          const languageCode = this.getNodeParameter('languageCode', i, 'en') as string;
          const headerMediaUrl = this.getNodeParameter('headerMediaUrl', i, '') as string;
          const buttonUrlParam = this.getNodeParameter('buttonUrlParam', i, '') as string;

          const varsData = this.getNodeParameter('bodyVariables', i, {}) as {
            variables?: Array<{ value: string }>;
          };
          const bodyVariables = (varsData.variables || []).map((v) => v.value);

          const payload: Record<string, unknown> = {
            senderId,
            to: recipientPhone,
            type: 'template',
            templateName,
            language: languageCode,
            bodyVariables,
          };

          if (headerMediaUrl) payload.headerMediaUrl = headerMediaUrl;
          if (buttonUrlParam) payload.buttonUrlParam = buttonUrlParam;

          const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: `${baseUrl}/messages/direct-send`,
            headers: {
              Authorization: `ApiKey ${credentials.apiKey}`,
              'X-API-Key': credentials.apiKey as string,
            },
            body: payload,
            json: true,
          };

          responseData = await this.helpers.httpRequest(requestOptions);
        }

        // ─── 3. CONTACT RESOURCE ───────────────────────────────────────────
        else if (resource === 'contact') {
          if (operation === 'create') {
            const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
            const displayName = this.getNodeParameter('displayName', i, '') as string;
            const email = this.getNodeParameter('email', i, '') as string;
            const tagsRaw = this.getNodeParameter('tags', i, '') as string;
            const optOutMarketing = this.getNodeParameter('optOutMarketing', i, false) as boolean;

            const tags = tagsRaw
              ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
              : [];

            const payload: Record<string, unknown> = {
              phoneNumber,
              optOutMarketing,
            };
            if (displayName) payload.displayName = displayName;
            if (email) payload.email = email;
            if (tags.length) payload.tags = tags;

            const requestOptions: IHttpRequestOptions = {
              method: 'POST',
              url: `${baseUrl}/contacts`,
              headers: {
                Authorization: `ApiKey ${credentials.apiKey}`,
                'X-API-Key': credentials.apiKey as string,
              },
              body: payload,
              json: true,
            };

            responseData = await this.helpers.httpRequest(requestOptions);
          } else if (operation === 'get') {
            const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;

            const requestOptions: IHttpRequestOptions = {
              method: 'GET',
              url: `${baseUrl}/contacts/by-phone/${encodeURIComponent(phoneNumber)}`,
              headers: {
                Authorization: `ApiKey ${credentials.apiKey}`,
                'X-API-Key': credentials.apiKey as string,
              },
              json: true,
            };

            responseData = await this.helpers.httpRequest(requestOptions);
          } else if (operation === 'search') {
            const query = this.getNodeParameter('query', i) as string;
            const limit = this.getNodeParameter('limit', i, 50) as number;

            const requestOptions: IHttpRequestOptions = {
              method: 'GET',
              url: `${baseUrl}/contacts`,
              qs: { query, limit },
              headers: {
                Authorization: `ApiKey ${credentials.apiKey}`,
                'X-API-Key': credentials.apiKey as string,
              },
              json: true,
            };

            responseData = await this.helpers.httpRequest(requestOptions);
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
