import * as yup from 'yup';

const createProductSchema = yup.object({
  body: yup.object().shape({
    name: yup.string().required(),
    category: yup.string().oneOf(['snack', 'side', 'drink', 'dessert']).required(),
    price: yup.number().min(1).required(),
    description: yup.string().required(),
    images: yup.array().of(yup.string()).required(),
  }),
});

const updateProductSchema = createProductSchema.clone().shape({
  params: yup.object().shape({
    id: yup.string().optional(),
  }),
});

export const productSchemas = {
  createProduct: createProductSchema,
  updateProduct: updateProductSchema,
};
