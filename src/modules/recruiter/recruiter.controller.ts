import { ApiError } from "../../errors/ApiError";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { uploadToImgBB } from "../../utils/imgbb";
import { recruiterSchema } from "./recruiter.schema";
import { recruiterService } from "./recruiter.service";

const updateRecruiter = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const body = req.body;
  if (!userId) {
    throw new ApiError("User not found", 404);
  }
  if (req.files) {
    const files = req.files as {
      logo?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    };
    console.log("files", files);
    if (files.logo) {
      const logoUrl = await uploadToImgBB(files.logo[0].buffer);
      body.logo = logoUrl.url;
    }
    if (files.coverImage) {
      const coverImageUrl = await uploadToImgBB(files.coverImage[0].buffer);
      body.coverImage = coverImageUrl.url;
    }
  }

  const validatedBody = recruiterSchema.parse(body);
  const result = await recruiterService.updateRecruiter(userId, validatedBody);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Recruiter updated successfully",
    data: result,
  });
});

export const recruiterController = {
  updateRecruiter,
};
