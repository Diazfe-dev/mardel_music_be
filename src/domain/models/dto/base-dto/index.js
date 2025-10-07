export class BaseDto {
    constructor(data = {}) {
        this.data = data;
        this.schema = null; // Se debe definir en las clases hijas
    }

    validate() {
        if (!this.schema) {
            throw new Error("Schema not defined. Please define schema in the child class.");
        }

        const { error } = this.schema.validate(this.data, { 
            abortEarly: false, // Retorna todos los errores, no solo el primero
            allowUnknown: false, // No permite campos desconocidos
            stripUnknown: true // Remueve campos desconocidos
        });

        if (error) {
            return error.details.map(detail => detail.message);
        }

        return []; // Sin errores
    }

    serialize() {
        if (!this.schema) {
            throw new Error("Schema not defined. Please define schema in the child class.");
        }

        const { error, value } = this.schema.validate(this.data, { 
            allowUnknown: false,
            stripUnknown: true 
        });

        if (error) {
            throw new Error(`Validation failed: ${error.details.map(d => d.message).join(', ')}`);
        }

        return value; // Datos validados y limpiados
    }

    // Método de utilidad para obtener datos sin validar
    getRawData() {
        return this.data;
    }
}