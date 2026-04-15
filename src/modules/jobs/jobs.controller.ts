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
  const userId = req.user?.id as string;
  const {
    page,
    limit,
    searchTerm,
    sortBy,
    location,
    jobType,
    salary,
    postedAnytime,
    seniorityLevel,
  } = req.query;
  const query = req.query;
  console.log(query);

  const result = await jobsService.getAllJobs(
    userId,
    page as string,
    limit as string,
    searchTerm as string,
    sortBy as "asc" | "desc",
    location as string,
    jobType as string,
    salary as string,
    postedAnytime as string,
    seniorityLevel as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Jobs fetched successfully",
    data: result.data,
    meta: result.meta,
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

//get job by id
const jobById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const useId = req.user?.id;
  const result = await jobsService.getJobById(useId as string, id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job details successfully",
    data: result,
  });
});

// save job
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

// get save job
const getSaveJob = catchAsync(async (req, res) => {
  const { page, limit, sortBy, sortOrder, searchTerm } = req.query;
  console.log(req.query);
  console.log(req.user?.id);

  const result = await jobsService.getSaveJob(req.user?.id as string, {
    page: page as string,
    limit: limit as string,
    sortBy: sortBy as string,
    searchTerm: searchTerm as string,
    sortOrder: sortOrder as "asc" | "desc",
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Save jobs fetched successfully",
    data: result,
  });
});

// unsave job
const unSaveJob = catchAsync(async (req, res) => {
  const result = await jobsService.unSaveJob(
    req.user?.id as string,
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job unsave successfully",
    data: result,
  });
});

// get company jobs
const getCompanyJobs = catchAsync(async (req, res) => {
  const result = await jobsService.getCompanyJobs(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company jobs fetched successfully",
    data: result,
  });
});
export const jobsController = {
  createJob,
  getAllJobs,
  getMyJobs,
  saveJob,
  jobById,
  getSaveJob,
  unSaveJob,
  getCompanyJobs,
};
