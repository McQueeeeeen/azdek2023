import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseStorageService {
  private readonly supabase;
  private readonly bucket: string;

  constructor(configService: ConfigService) {
    const supabaseUrl = configService.getOrThrow<string>("SUPABASE_URL");
    const serviceRoleKey = configService.getOrThrow<string>("SUPABASE_SERVICE_ROLE_KEY");
    this.bucket = configService.getOrThrow<string>("SUPABASE_STORAGE_BUCKET");
    this.supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }

  async uploadProductImage(productId: string, fileBuffer: Buffer, fileName: string, contentType: string): Promise<{ path: string }> {
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectPath = `products/${productId}/${Date.now()}-${safeName}`;
    const { error } = await this.supabase.storage.from(this.bucket).upload(objectPath, fileBuffer, {
      contentType,
      upsert: false,
    });
    if (error) {
      throw new Error(`Supabase storage upload failed: ${error.message}`);
    }
    return { path: objectPath };
  }

  getPublicUrl(path: string): string {
    return this.supabase.storage.from(this.bucket).getPublicUrl(path).data.publicUrl;
  }

  async createSignedUrl(path: string, expiresInSeconds = 3600): Promise<string> {
    const { data, error } = await this.supabase.storage.from(this.bucket).createSignedUrl(path, expiresInSeconds);
    if (error || !data?.signedUrl) {
      throw new Error(`Failed to create signed url: ${error?.message ?? "unknown"}`);
    }
    return data.signedUrl;
  }
}

