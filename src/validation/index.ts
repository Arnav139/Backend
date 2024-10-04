// src/validation/index.ts

import userValidators from "./userValidation";
import DocumentValidators from "./documentValidation";
import { validateRequest } from "../middlewares/validateRequest";

// Export user validation middleware
export const validateRegister = validateRequest(userValidators.registerUserSchema);
export const validateLogin = validateRequest(userValidators.loginUserSchema);
export const validateLogout = validateRequest(userValidators.logoutUserSchema);

// Export document validation middleware
export const validateCreateDocument = validateRequest(DocumentValidators.createDocumentSchema);
export const validateUpdateContent = validateRequest(DocumentValidators.updateContentSchema);
export const validateGetDocuments = validateRequest(DocumentValidators.getDocumentsSchema);
export const validateDeleteDocument = validateRequest(DocumentValidators.deleteDocumentSchema);
export const validateToggleIsFavorite = validateRequest(DocumentValidators.toggleIsFavoriteSchema);
