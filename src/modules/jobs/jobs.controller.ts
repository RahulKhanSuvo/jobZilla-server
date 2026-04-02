import { catchAsync } from "../../shared/catchAsync";
import { jobsService } from "./jobs.service";
import { sendResponse } from "../../shared/sendResponse";

const createJob = catchAsync(async (req, res) => {
  const result = await jobsService.createJob(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

const getAllJobs = catchAsync(async (req, res) => {
  const result = await jobsService.getAllJobs();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Jobs fetched successfully",
    data: result,
  });
});

export const jobsController = {
  createJob,
  getAllJobs,
};
