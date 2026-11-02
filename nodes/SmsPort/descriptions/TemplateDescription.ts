import type { INodeProperties } from 'n8n-workflow';

export const templateOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['template'],
      },
    },
    options: [
      {
        name: 'Send',
        value: 'send',
        description: 'Send a pre-approved Meta WhatsApp Template message',
        action: 'Send a WhatsApp template',
      },
    ],
    default: 'send',
  },
];

export const templateFields: INodeProperties[] = [
  {
    displayName: 'Sender Phone Number',
    name: 'senderId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getSenders',
    },
    displayOptions: {
      show: {
        resource: ['template'],
        operation: ['send'],
      },
    },
    default: '',
    required: true,
    description: 'Select your verified WhatsApp Business phone number from SMSPort',
  },
  {
    displayName: 'Recipient Phone Number',
    name: 'recipientPhone',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['template'],
        operation: ['send'],
      },
    },
    default: '',
    required: true,
    placeholder: '+919876543210',
    description: 'The recipient phone number including international country code (E.164 format)',
  },
  {
    displayName: 'Template Name',
    name: 'templateName',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getTemplates',
    },
    displayOptions: {
      show: {
        resource: ['template'],
        operation: ['send'],
      },
    },
    default: '',
    required: true,
    description: 'Select an approved WhatsApp template synced with Meta Cloud API',
  },
  {
    displayName: 'Language Code',
    name: 'languageCode',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['template'],
        operation: ['send'],
      },
    },
    default: 'en',
    placeholder: 'en, en_US, hi',
    description: 'The language code registered for this approved template',
  },
  {
    displayName: 'Body Variables',
    name: 'bodyVariables',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['template'],
        operation: ['send'],
      },
    },
    default: {},
    placeholder: 'Add Variable',
    description: 'Positional values for {{1}}, {{2}}, etc. defined in your template body',
    options: [
      {
        name: 'variables',
        displayName: 'Variable',
        values: [
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            required: true,
            placeholder: 'John Doe',
            description: 'Replacement text for this dynamic parameter',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Header Media URL',
    name: 'headerMediaUrl',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['template'],
        operation: ['send'],
      },
    },
    default: '',
    placeholder: 'https://example.com/banner.png',
    description: 'Required only if your template was created with an Image, Video, or Document header',
  },
  {
    displayName: 'Dynamic Button URL Variable',
    name: 'buttonUrlParam',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['template'],
        operation: ['send'],
      },
    },
    default: '',
    placeholder: 'orders/12345',
    description: 'Dynamic suffix parameter if your template CTA button has a variable URL',
  },
];
