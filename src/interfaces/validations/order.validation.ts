import * as yup from 'yup';

const updateOrderProductionStatusSchema = yup.object().shape({
  params: yup.object().shape({
    id: yup.string().optional(),
  }),
  body: yup.object().shape({
    status: yup.string().oneOf(['received', 'in_preparation', 'ready', 'completed']).required(),
  }),
});

export const orderSchemas = {
  updateOrderProductionStatus: updateOrderProductionStatusSchema,
};
