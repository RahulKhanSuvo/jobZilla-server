import { catchAsync } from "../../shared/catchAsync";
import { jobsService, IJobOptions } from "./jobs.service";
import { sendResponse } from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { jobFilterableFields } from "./job.constant";

const createJob = catchAsync(async (req, res) => {
  const result = await jobsService.createJob(req.user?.id as string, req.body);
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

const getMyJobs = catchAsync(async (req, res) => {
  const filters = pick(req.query, jobFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await jobsService.getMyJobs(
    req.user?.id as string,
    {
      ...filters,
      ...options,
    } as IJobOptions,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My jobs fetched successfully",
    data: result,
  });
});

const saveJob = catchAsync(async (req, res) => {
  const result = await jobsService.saveJob(
    req.user?.id as string,
    req.body.jobId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Job save successfully",
    data: result,
  });
});
export const jobsController = {
  createJob,
  getAllJobs,
  getMyJobs,
  saveJob,
};
