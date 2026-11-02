import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['contact'],
      },
    },
    options: [
      {
        name: 'Create or Update',
        value: 'create',
        description: 'Create a new contact or update an existing contact in SMSPort',
        action: 'Create or update a contact',
      },
      {
        name: 'Get by Phone',
        value: 'get',
        description: 'Retrieve a contact by phone number',
        action: 'Get a contact by phone',
      },
      {
        name: 'Search',
        value: 'search',
        description: 'Search contacts by name or phone query',
        action: 'Search contacts',
      },
    ],
    default: 'create',
  },
];

export const contactFields: INodeProperties[] = [
  {
    displayName: 'Phone Number',
    name: 'phoneNumber',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create', 'get'],
      },
    },
    default: '',
    required: true,
    placeholder: '+919876543210',
    description: 'Contact phone number in international E.164 format',
  },
  {
    displayName: 'Display Name',
    name: 'displayName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: 'Rahul Sharma',
    description: 'Full name or company name of the contact',
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@example.com',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Optional email address for the contact',
  },
  {
    displayName: 'Tags',
    name: 'tags',
    type: 'string',
    placeholder: 'vip, lead, new',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Comma-separated tags to assign to the contact in SMSPort',
  },
  {
    displayName: 'Opt Out of Marketing',
    name: 'optOutMarketing',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['create'],
      },
    },
    default: false,
    description: 'Whether this contact has opted out of promotional broadcasts',
  },
  {
    displayName: 'Search Query',
    name: 'query',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['search'],
      },
    },
    default: '',
    required: true,
    placeholder: 'Rahul or +919876',
    description: 'Phone number fragment or name to search',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['search'],
      },
    },
    default: 50,
    description: 'Maximum number of matching contacts to return',
  },
];
