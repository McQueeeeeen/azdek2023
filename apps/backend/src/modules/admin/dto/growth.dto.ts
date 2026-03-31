import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min } from "class-validator";

enum ExperimentDecisionValue {
  RUNNING = "running",
  SCALE = "scale",
  FIX = "fix",
  STOP = "stop",
}

export class CreateExperimentDto {
  @IsString()
  @MaxLength(1000)
  hypothesis!: string;

  @IsString()
  @MaxLength(1000)
  changeDescription!: string;

  @IsString()
  @MaxLength(120)
  targetMetric!: string;

  @IsString()
  @MaxLength(120)
  owner!: string;
}

export class DecideExperimentDto {
  @IsEnum(ExperimentDecisionValue)
  decision!: "running" | "scale" | "fix" | "stop";

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  baselineValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  resultValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  upliftPercent?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class UpsertWeeklyReviewDto {
  @Type(() => Date)
  @IsDate()
  weekStart!: Date;

  @IsObject()
  facts!: Record<string, unknown>;

  @IsString()
  @MaxLength(2000)
  wins!: string;

  @IsString()
  @MaxLength(2000)
  losses!: string;

  @IsString()
  @MaxLength(2000)
  decisions!: string;

  @IsString()
  @MaxLength(4000)
  nextActions!: string;

  @IsString()
  @MaxLength(120)
  owner!: string;

  @Type(() => Date)
  @IsDate()
  deadline!: Date;

  @IsString()
  @MaxLength(1000)
  expectedImpact!: string;
}

export class RefreshMartsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dryRun?: number;
}

export class UpsertChannelSpendDto {
  @Type(() => Date)
  @IsDate()
  day!: Date;

  @IsString()
  @MaxLength(120)
  source!: string;

  @IsString()
  @MaxLength(120)
  medium!: string;

  @IsString()
  @MaxLength(200)
  campaign!: string;

  @IsString()
  @MaxLength(40)
  channelGroup!: string;

  @Type(() => Number)
  @IsNumber()
  spendAmount!: number;
}

export class UpsertOrderCostDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cogsAmount?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  logisticsAmount?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  feesAmount?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  refundsAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
