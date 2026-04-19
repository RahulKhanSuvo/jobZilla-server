import { Router } from "express";
import { followCompanyController } from "./followCompany.controller";
import { authGard } from "../../middleware/authGard";
import { UserRole } from "../../generated/prisma/enums";

const followCompanyRoutes = Router();

followCompanyRoutes.get(
  "/",
  authGard({ roles: [UserRole.CANDIDATE] }),
  followCompanyController.getAllFollwedCompany,
);
followCompanyRoutes.post(
  "/follow/:companyId",
  authGard({ roles: [UserRole.CANDIDATE] }),
  followCompanyController.followACompany,
);
followCompanyRoutes.delete(
  "/unfollow/:companyId",
  authGard({ roles: [UserRole.CANDIDATE] }),
  followCompanyController.unFollowACompany,
);

export default followCompanyRoutes;
