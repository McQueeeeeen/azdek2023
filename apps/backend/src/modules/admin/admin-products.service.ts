import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../shared/infrastructure/prisma.service";
import { SupabaseStorageService } from "../../infrastructure/storage/supabase-storage.service";

@Injectable()
export class AdminProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService,
  ) {}

  async uploadProductImage(productId: string, file: Express.Multer.File): Promise<{ path: string; publicUrl: string }> {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const uploaded = await this.storage.uploadProductImage(productId, file.buffer, file.originalname, file.mimetype);
    return {
      path: uploaded.path,
      publicUrl: this.storage.getPublicUrl(uploaded.path),
    };
  }
}

