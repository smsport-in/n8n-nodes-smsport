import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class SmsPortApi implements ICredentialType {
  name = 'smsPortApi';
  displayName = 'SMSPort API';
  documentationUrl = 'https://api.smsport.in/api/docs';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Your SMSPort API key (starting with sk_live_...). Found under SMSPort Console -> Integrations -> API Integration (https://smsport.in/setup/api-integration).',
      required: true,
    },
    {
      displayName: 'API Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.smsport.in/api/v1',
      description: 'The production base URL of the SMSPort API',
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=ApiKey {{$credentials.apiKey}}',
        'X-API-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/ping',
      method: 'GET',
    },
  };
}
