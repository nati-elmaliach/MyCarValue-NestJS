import { Body, Patch, Param, Controller, Post, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDto } from './dtos/create-reports.dto';
import { ReportsService } from './reports.service';
import { User } from '../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';




@Controller('reports')
export class ReportsController {

  constructor(private reportsService: ReportsService) { }


  @Get()
  getEstimate(@Query() query: GetEstimateDto) { // how to validate those exact fields ?
    return this.reportsService.createEstimate(query);

  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch("/:id")
  @UseGuards(AdminGuard)
  approveReport(@Param("id") id: string, @Body() body: ApproveReportDto) {
    const { approved } = body;
    return this.reportsService.changeApproval(id, approved);
  }



}
