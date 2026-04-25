import { ApiError } from "../../errors/ApiError";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { uploadToImgBB } from "../../utils/imgbb";
import { recruiterService } from "./recruiter.service";

const updateRecruiter = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const body = req.body;
  if (!userId) {
    throw new ApiError("User not found", 404);
  }

  const files =
    (req.files as {
      logo?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    }) || {};

  // Handle logo: multer file OR base64 string
  if (files.logo) {
    const logoUrl = await uploadToImgBB(files.logo[0].buffer);
    body.logo = logoUrl.url;
  } else if (body.logo && body.logo.startsWith("data:")) {
    const base64Data = body.logo.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const logoUrl = await uploadToImgBB(buffer);
    body.logo = logoUrl.url;
  }

  if (files.coverImage) {
    const coverImageUrl = await uploadToImgBB(files.coverImage[0].buffer);
    body.coverImage = coverImageUrl.url;
  } else if (body.coverImage && body.coverImage.startsWith("data:")) {
    const base64Data = body.coverImage.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const coverImageUrl = await uploadToImgBB(buffer);
    body.coverImage = coverImageUrl.url;
  }

  const result = await recruiterService.updateRecruiter(userId, body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Recruiter updated successfully",
    data: result,
  });
});

const getCompany = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await recruiterService.getCompanyById(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Company fetched successfully",
    data: result,
  });
});

export const recruiterController = {
  updateRecruiter,
  getCompany,
};
