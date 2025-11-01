import { useEffect, useRef, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { focacciaSchema } from '../../../schemas/focacciaSchema';
import { ImageService } from '../../../services/ImageService';
import { useFocacciaContext } from '../../../context/focacciaContext';
import type { FocacciaCreate } from '../../../types';
import { toast } from 'react-toastify';
import { getApiKeyFromUrl } from '../../../services/ProductService';
import './_adminForm.scss';

export const AdminForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createFocaccia, updateFocaccia, focacciaEdit, setFocacciaEdit, setIsOpen } = useFocacciaContext();
  const apiKey = getApiKeyFromUrl();
  const isValidApiKey = apiKey === 'focacciaCrostiSecret';
  const [previewUrl, setPreviewUrl] = useState<string | null>(focacciaEdit?.imageUrl || null);

  useEffect(() => {
    if (focacciaEdit && focacciaEdit.imageUrl) {
      setPreviewUrl(focacciaEdit.imageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [focacciaEdit]);

  return (
    <div className='adminFormContainer'>
      {!isValidApiKey && (
        <div className='error'>
          ⚠️ No tienes permisos para operar el ABM. Ingresa con la URL que incluya
        </div>
      )}
      <h2>{focacciaEdit ? 'Editar Focaccia' : 'Nueva Focaccia'}</h2>
      <Formik
        enableReinitialize
        initialValues={
          focacciaEdit ? {
            name: focacciaEdit.name,
            description: focacciaEdit.description,
            price: focacciaEdit.price,
            isVeggie: focacciaEdit.isVeggie,
            featured: focacciaEdit.featured,
          } : {
            name: '',
            description: '',
            price: '',
            isVeggie: true,
            featured: false,
          }
        }
        validationSchema={focacciaSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            let imageUrl = focacciaEdit?.imageUrl || '';
            let imagePublicId = focacciaEdit?.imagePublicId || '';
            const file = fileInputRef.current?.files?.[0];
            if (file) {
              // Si estamos editando y hay imagen previa, primero la borramos
              if (focacciaEdit && focacciaEdit.imagePublicId) {
                try {
                  await ImageService.deleteImage(focacciaEdit.imagePublicId);
                } catch (e) {
                  console.error('Error deleting previous image from Cloudinary', e);
                  toast.warn('No se pudo borrar la imagen anterior de Cloudinary');
                }
              }
              const uploadRes = await ImageService.uploadImage(file);
              if (uploadRes.success) {
                imageUrl = uploadRes.url;
                imagePublicId = uploadRes.public_id;
              } else {
                toast.error('Error al subir la imagen: ' + (uploadRes.error || ''));
                setSubmitting(false);
                return;
              }
            } else if (!focacciaEdit) {
              toast.error('Debes seleccionar una imagen.');
              setSubmitting(false);
              return;
            }

            if (focacciaEdit) {
              // Modo edición
              await updateFocaccia(focacciaEdit.id, {
                ...focacciaEdit,
                ...values,
                price: Number(values.price),
                imageUrl,
                imagePublicId,
              });
              toast.success('Focaccia actualizada exitosamente');
              setFocacciaEdit(null);
            } else {
              // Modo creación
              const focacciaData: FocacciaCreate = {
                ...values,
                price: Number(values.price),
                imageUrl,
                imagePublicId,
                featured: values.featured,
                isVeggie: values.isVeggie,
                description: values.description,
                name: values.name,
              };
              await createFocaccia(focacciaData);
              toast.success('Focaccia creada exitosamente');
            }
            resetForm();
            setPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          } catch (err) {
            toast.error('Error al guardar la focaccia: ' + (err));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className='adminForm' style={{ opacity: isValidApiKey ? 1 : 0.5, pointerEvents: isValidApiKey ? 'auto' : 'none' }}>

            <div className='row'>
              <div className='formGroup'>
                <label htmlFor="name">Nombre:</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div className='formGroup'>
                <label htmlFor="price">Precio:</label>
                <Field type="number" id="price" name="price" />
                <ErrorMessage name="price" component="div" className="error" />
              </div>
            </div>

            <div className='formGroup'>
              <label htmlFor="description">Descripción:</label>
              <Field as="textarea" id="description" name="description" />
              <ErrorMessage name="description" component="div" className="error" />
            </div>

            <div className='imageRow'>
              <div className='formGroup'>
                <label htmlFor="image">Imagen:</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={e => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file));
                    } else if (focacciaEdit && focacciaEdit.imageUrl) {
                      setPreviewUrl(focacciaEdit.imageUrl);
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
                />
                <ErrorMessage name="image" component="div" className="error" />
              </div>
              <div className='previewImageContainer'>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className='previewImage'
                  />
                )}
              </div>
            </div>

            <div className='checkboxRow'>
              <div className='formGroup'>
                <label htmlFor="isVeggie">¿Es veggie?</label>
                <Field type="checkbox" name="isVeggie" />
                <ErrorMessage name="isVeggie" component="div" className="error" />
              </div>
              <div className='formGroup'>
                <label>¿Destacado?</label>
                <Field type="checkbox" name="featured" />
                <ErrorMessage name="featured" component="div" className="error" />
              </div>
            </div>

            <div className='submitButtonContainer'>
              <button type="submit" className='submitButton' disabled={isSubmitting}>
                {focacciaEdit ? (isSubmitting ? 'Actualizando...' : 'Actualizar Focaccia') : (isSubmitting ? 'Creando...' : 'Crear Focaccia')}
              </button>
              <button type='button' onClick={() => {
                setIsOpen(false);
                setFocacciaEdit(null);
              }}>Cancelar</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
