import * as yup from 'yup';

const createOrderSchema = yup.object({
  body: yup.object().shape({
    customerId: yup.string().optional(),
    products: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string().required(),
          quantity: yup.number().required(),
        }),
      )
      .min(1)
      .required(),
  }),
});

const updateOrderStatusSchema = yup.object().shape({
  params: yup.object().shape({
    id: yup.string().optional(),
  }),
  body: yup.object().shape({
    status: yup.string().oneOf(['received', 'in_preparation', 'ready', 'completed']).required(),
  }),
});

export const orderSchemas = {
  createOrder: createOrderSchema,
  updateOrderStatus: updateOrderStatusSchema,
};
