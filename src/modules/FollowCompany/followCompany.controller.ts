import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const getAllFollwedCompany = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Followed companies fetched successfully",
    data: [],
  });
});
const followACompany = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company followed successfully",
    data: [],
  });
});
const unFollowACompany = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company unfollowed successfully",
    data: [],
  });
});
export const followCompanyController = {
  getAllFollwedCompany,
  followACompany,
  unFollowACompany,
};
