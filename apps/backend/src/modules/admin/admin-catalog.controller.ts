import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AdminOperationsService } from "./admin-operations.service";
import {
  CreateCategoryDto,
  CreateProductDto,
  CreateVariantDto,
  UpdateCategoryDto,
  UpdateProductDto,
} from "./dto/admin-catalog.dto";

@Controller("admin/catalog")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminCatalogController {
  constructor(private readonly adminOps: AdminOperationsService) {}

  @Get("categories")
  @Roles("owner", "manager", "content_editor")
  listCategories(): ReturnType<AdminOperationsService["listCategories"]> {
    return this.adminOps.listCategories();
  }

  @Post("categories")
  @Roles("owner", "manager", "content_editor")
  createCategory(@Body() dto: CreateCategoryDto): ReturnType<AdminOperationsService["createCategory"]> {
    return this.adminOps.createCategory(dto);
  }

  @Patch("categories/:categoryId")
  @Roles("owner", "manager", "content_editor")
  updateCategory(
    @Param("categoryId") categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ): ReturnType<AdminOperationsService["updateCategory"]> {
    return this.adminOps.updateCategory(categoryId, dto);
  }

  @Post("products")
  @Roles("owner", "manager", "content_editor")
  createProduct(@Body() dto: CreateProductDto): ReturnType<AdminOperationsService["createProduct"]> {
    return this.adminOps.createProduct(dto);
  }

  @Patch("products/:productId")
  @Roles("owner", "manager", "content_editor")
  updateProduct(
    @Param("productId") productId: string,
    @Body() dto: UpdateProductDto,
  ): ReturnType<AdminOperationsService["updateProduct"]> {
    return this.adminOps.updateProduct(productId, dto);
  }

  @Post("products/:productId/variants")
  @Roles("owner", "manager", "content_editor")
  createVariant(
    @Param("productId") productId: string,
    @Body() dto: CreateVariantDto,
  ): ReturnType<AdminOperationsService["createVariant"]> {
    return this.adminOps.createVariant(productId, dto);
  }
}

