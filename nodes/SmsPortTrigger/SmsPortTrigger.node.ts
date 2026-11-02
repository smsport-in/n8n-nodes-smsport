import type {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';

export class SmsPortTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'SMSPort Trigger',
    name: 'smsPortTrigger',
    icon: 'file:smsport-logo.svg',
    group: ['trigger'],
    version: 1,
    description: 'Triggers a workflow when real-time WhatsApp events occur in SMSPort',
    defaults: {
      name: 'SMSPort Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'smsPortApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'All Events',
            value: 'any',
            description: 'Trigger on all inbound messages, delivery receipts, and contact events',
          },
          {
            name: 'New Incoming WhatsApp Message',
            value: 'message.inbound',
            description: 'Triggers immediately when a user replies or sends a WhatsApp message to your business',
          },
          {
            name: 'Message Delivery Status Updated',
            value: 'message.status',
            description: 'Triggers when a message is sent, delivered, read, or failed',
          },
          {
            name: 'New Contact Created',
            value: 'contact.created',
            description: 'Triggers when a new customer contact is added to SMSPort',
          },
        ],
        default: 'any',
        required: true,
        description: 'The real-time SMSPort event that should fire this workflow',
      },
      {
        displayName: 'Webhook Registration Instructions',
        name: 'webhookNotice',
        type: 'notice',
        default: 'Copy the Webhook URL above and paste it into your SMSPort Dashboard under Setup -> API Keys -> Webhook URL to start streaming live events directly into this workflow.',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const body = (req.body || {}) as IDataObject;
    const selectedEvent = this.getNodeParameter('event', 0) as string;

    // Filter event if user selected a specific type
    const payloadEvent = (body.event as string) || (body.type as string);
    if (selectedEvent !== 'any' && payloadEvent && payloadEvent !== selectedEvent) {
      return {};
    }

    return {
      workflowData: [this.helpers.returnJsonArray([body])],
    };
  }
}
