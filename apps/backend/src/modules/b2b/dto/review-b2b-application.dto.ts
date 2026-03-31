import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";

enum ReviewStatus {
  approved = "approved",
  rejected = "rejected",
}

export class ReviewB2BApplicationDto {
  @IsEnum(ReviewStatus)
  status!: "approved" | "rejected";

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNotes?: string;
}

