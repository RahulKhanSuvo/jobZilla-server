import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { getPagination } from "../../utils/pagination";
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
  const { searchTerm, status, jobFilter, sortBy } = req.query;
  const { skip, limit } = getPagination(req.query);
  const result = await applicationService.getAllApplications(
    userId,
    {
      searchTerm: searchTerm as string,
      status: status as string,
      jobFilter: jobFilter as string,
      sortBy: sortBy as string,
    },
    skip,
    limit,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Applications fetched successfully",
    data: result.applications,
    meta: result.meta,
  });
});

const updateApplicationStatus = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const { id: applicationId } = req.params;
  const { status } = req.body;
  const result = await applicationService.updateApplicationStatus(
    userId,
    applicationId as string,
    status,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application status updated successfully",
    data: result,
  });
});

const getApplicationById = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const { id: applicationId } = req.params;
  const result = await applicationService.getApplicationById(
    userId,
    applicationId as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Application fetched successfully",
    data: result,
  });
});

const getCandidateAppliedJobs = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const result = await applicationService.getCandidateAppliedJobs(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidate applied jobs fetched successfully",
    data: result,
  });
});

export const ApplicationController = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getCandidateAppliedJobs,
};
