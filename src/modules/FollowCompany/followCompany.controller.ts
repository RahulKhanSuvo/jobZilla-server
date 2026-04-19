import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { followACompanyService } from "./followCompany.service";
import { getPagination } from "../../utils/pagination";
import { ApiError } from "../../errors/ApiError";

const getAllFollwedCompany = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const pagination = getPagination(req.query);
  const result = await followACompanyService.getAllFollwedCompany(
    userId,
    pagination,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Followed companies fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});
const followACompany = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const companyId = req.params.companyId;
  console.log(companyId);

  if (!userId) throw new ApiError("no user id", 400);
  if (companyId === userId) {
    throw new ApiError("You can not follow yourself", 400);
  }
  const result = await followACompanyService.followACompany(
    userId,
    companyId as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company followed successfully",
    data: result,
  });
});
const unFollowACompany = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const companyId = req.params.companyId;
  console.log(companyId);

  if (!userId) throw new ApiError("no user id", 400);
  if (companyId === userId) {
    throw new ApiError("You can not unfollow yourself", 400);
  }
  const result = await followACompanyService.unFollowACompany(
    userId,
    companyId as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company unfollowed successfully",
    data: result,
  });
});
export const followCompanyController = {
  getAllFollwedCompany,
  followACompany,
  unFollowACompany,
};
