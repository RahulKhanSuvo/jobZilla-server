import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { applicationService } from "./application.service";

const createApplication = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const { jobId, resumeId } = req.body;
  const result = await applicationService.createApplication(
    userId,
    jobId,
    resumeId,
    req.file as Express.Multer.File,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application created successfully",
    data: result,
  });
});

const getAllApplications = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const result = await applicationService.getAllApplications(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Applications fetched successfully",
    data: result,
  });
});

export const ApplicationController = {
  createApplication,
  getAllApplications,
};
