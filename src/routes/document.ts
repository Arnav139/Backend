import { Router  } from "express";
import controller from "../controllers";
import { authenticateUser } from "../middleware"; 
import { validateRequest } from "../middleware";
import validators from "../validators";

const router = Router();

router.get("/abc",async(req,res):Promise<any>=>{
  return res.status(200).send({ status:true, message: "Api is running" });
});

router.post("/create",authenticateUser,validateRequest(validators.auth.createDocument) ,controller.document.createDocumentController);
router.get("/", authenticateUser,validateRequest(validators.auth.getDocumentsById) ,controller.document.getDocumentsByUserIdController);
router.put("/:documentId",authenticateUser, controller.document.toggleIsFavoriteByDocumentId);
router.delete("/:documentId", authenticateUser, controller.document.deleteDocumentByUserId);
router.get("/:documentId",authenticateUser,controller.document.getDocumentById)
router.patch("/:documentId",authenticateUser,controller.document.updateDocument)

export default router;
