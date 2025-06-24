import * as yup from 'yup';

const createCustomerSchema = yup.object({
  body: yup.object().shape({
    cpf: yup.string().required(),
    name: yup.string().required(),
    email: yup.string().email().required(),
  }),
});

export const customerSchemas = {
  createCustomer: createCustomerSchema,
};
