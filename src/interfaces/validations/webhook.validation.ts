import * as yup from 'yup';

const paymentWebhookSchema = yup.object().shape({
  params: yup.object().shape({
    id: yup.string().required(),
  }),
  body: yup.object().shape({
    status: yup.string().oneOf(['paid', 'expired']).required(),
  }),
});

export const webhookSchemas = {
  paymentWebhook: paymentWebhookSchema,
};
