import type { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['message'],
      },
    },
    options: [
      {
        name: 'Send',
        value: 'send',
        description: 'Send a WhatsApp text, media, or interactive button message',
        action: 'Send a WhatsApp message',
      },
    ],
    default: 'send',
  },
];

export const messageFields: INodeProperties[] = [
  {
    displayName: 'Sender Phone Number',
    name: 'senderId',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getSenders',
    },
    displayOptions: {
      show: {
        resource: ['message'],
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
        resource: ['message'],
        operation: ['send'],
      },
    },
    default: '',
    required: true,
    placeholder: '+919876543210',
    description: 'The recipient phone number including international country code (E.164 format)',
  },
  {
    displayName: 'Message Type',
    name: 'messageType',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send'],
      },
    },
    options: [
      {
        name: 'Text Message',
        value: 'text',
        description: 'Send a plain text message',
      },
      {
        name: 'Image Message',
        value: 'image',
        description: 'Send an image via public URL with optional caption',
      },
      {
        name: 'Document / PDF Message',
        value: 'document',
        description: 'Send a PDF, docx, or document file via public URL',
      },
      {
        name: 'Interactive Reply Buttons',
        value: 'interactive_button',
        description: 'Send a text message with up to 3 quick-reply buttons',
      },
    ],
    default: 'text',
    description: 'The format of the WhatsApp message to send',
  },
  {
    displayName: 'Message Text',
    name: 'messageText',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send'],
        messageType: ['text', 'interactive_button'],
      },
    },
    default: '',
    required: true,
    description: 'The text content of your WhatsApp message',
  },
  {
    displayName: 'Media URL',
    name: 'mediaUrl',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send'],
        messageType: ['image', 'document'],
      },
    },
    default: '',
    required: true,
    placeholder: 'https://example.com/file.jpg',
    description: 'Publicly accessible URL of the image or document to deliver',
  },
  {
    displayName: 'Caption',
    name: 'caption',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send'],
        messageType: ['image', 'document'],
      },
    },
    default: '',
    description: 'Optional caption to accompany the image or document',
  },
  {
    displayName: 'Document File Name',
    name: 'fileName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send'],
        messageType: ['document'],
      },
    },
    default: '',
    placeholder: 'Invoice-1024.pdf',
    description: 'Optional filename displayed on the recipient WhatsApp client',
  },
  {
    displayName: 'Interactive Buttons',
    name: 'buttons',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
      maxValue: 3,
    },
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send'],
        messageType: ['interactive_button'],
      },
    },
    default: {},
    placeholder: 'Add Button',
    description: 'Add up to 3 quick-reply buttons (Max 20 characters per button)',
    options: [
      {
        name: 'buttonValues',
        displayName: 'Button',
        values: [
          {
            displayName: 'Button ID',
            name: 'id',
            type: 'string',
            default: '',
            required: true,
            placeholder: 'btn_yes',
            description: 'Unique payload identifier returned in webhooks when clicked',
          },
          {
            displayName: 'Button Title',
            name: 'title',
            type: 'string',
            default: '',
            required: true,
            placeholder: 'Yes, Confirm',
            description: 'Label shown inside the button (max 20 characters)',
          },
        ],
      },
    ],
  },
];
