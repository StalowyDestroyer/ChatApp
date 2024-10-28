import { DataTypes, Model, ModelStatic, Op } from "sequelize";
import { Request } from "express";

export const filter = (req: Request, model: ModelStatic<Model>) => {
  try {
    const attributes = model.getAttributes();

    return Object.keys(attributes).reduce((acc, key) => {
      const queryValue = req.query[key];

      if (queryValue !== undefined) {
        if (attributes[key].type instanceof DataTypes.INTEGER) {
          acc[key] = Number(queryValue);
        } else if (attributes[key].type instanceof DataTypes.STRING) {
          acc[key] = { [Op.like]: `%${queryValue}%` };
        } else {
          console.warn(`Unsupported attribute type for key: ${key}`);
        }
      }

      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error("Error in filter function:", error);
    throw error;
  }
};
