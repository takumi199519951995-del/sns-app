import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  displayName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  bio?: string;
}