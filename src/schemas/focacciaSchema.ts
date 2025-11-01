import * as Yup from 'yup';

export const focacciaSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    price: Yup.number().typeError('Debe ser un número').positive('Debe ser mayor a 0').required('El precio es obligatorio'),
    isVeggie: Yup.boolean(),
    featured: Yup.boolean(),
});
