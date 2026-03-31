import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { AUTH_REPOSITORY, AuthRepository } from "../../application/auth/repositories/auth.repository";
import { JwtPayload } from "./domain/jwt-payload.interface";
import { UserRole } from "./domain/user-role.enum";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterCustomerDto } from "./dto/register-customer.dto";

interface AuthUserResponse {
  id: string;
  email: string;
  role: UserRole;
  customerId: string | null;
}

interface TokenPairResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  accessExpiresIn: string;
  refreshExpiresIn: string;
  user: AuthUserResponse;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerCustomer(dto: RegisterCustomerDto): Promise<TokenPairResponse> {
    const email = dto.email.toLowerCase();
    const existing = await this.authRepository.findActiveUserByEmail(email);
    if (existing) {
      throw new ConflictException("User with this email already exists");
    }

    const role = dto.customerType === "b2b" ? "b2b_customer" : "customer";
    const user = await this.authRepository.createCustomerUser({
      email,
      passwordHash: await hash(dto.password, 10),
      role,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      customerType: dto.customerType,
      isWholesaler: dto.customerType === "b2b",
    });

    return this.issueTokenPair(user);
  }

  async login(dto: LoginDto): Promise<TokenPairResponse> {
    const email = dto.email.toLowerCase();
    const user = await this.authRepository.findActiveUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatched = await compare(dto.password, user.passwordHash);
    if (!passwordMatched) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.issueTokenPair(user);
  }

  async refresh(dto: RefreshTokenDto): Promise<TokenPairResponse> {
    const refreshSecret = this.configService.getOrThrow<string>("JWT_REFRESH_SECRET");
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(dto.refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.authRepository.findActiveUserById(payload.sub);
    if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      throw new UnauthorizedException("Invalid refresh session");
    }
    if (user.refreshTokenExpiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException("Refresh token expired");
    }

    const validStoredToken = await compare(dto.refreshToken, user.refreshTokenHash);
    if (!validStoredToken) {
      throw new UnauthorizedException("Invalid refresh session");
    }

    return this.issueTokenPair(user);
  }

  async logout(userId: string): Promise<{ success: true }> {
    await this.authRepository.updateRefreshToken({
      userId,
      refreshTokenHash: null,
      refreshTokenExpiresAt: null,
    });
    return { success: true };
  }

  async me(userId: string): Promise<AuthUserResponse> {
    const user = await this.authRepository.findActiveUserById(userId);
    if (!user) {
      throw new UnauthorizedException("User is not active");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      customerId: user.customerId,
    };
  }

  private async issueTokenPair(user: {
    id: string;
    email: string;
    role: UserRole;
    customerId: string | null;
  }): Promise<TokenPairResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      customerId: user.customerId ?? undefined,
    };

    const accessExpiresIn = this.configService.get<string>("JWT_ACCESS_TTL", "15m");
    const refreshExpiresIn = this.configService.get<string>("JWT_REFRESH_TTL", "30d");

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: accessExpiresIn,
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: refreshExpiresIn,
      secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
    });

    await this.authRepository.updateRefreshToken({
      userId: user.id,
      refreshTokenHash: await hash(refreshToken, 10),
      refreshTokenExpiresAt: new Date(Date.now() + this.ttlToMs(refreshExpiresIn)),
    });

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      accessExpiresIn,
      refreshExpiresIn,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        customerId: user.customerId,
      },
    };
  }

  private ttlToMs(ttl: string): number {
    const match = /^(\d+)([smhd])$/.exec(ttl.trim());
    if (!match) {
      return 30 * 24 * 60 * 60 * 1000;
    }

    const value = Number(match[1]);
    const unit = match[2];

    if (unit === "s") {
      return value * 1000;
    }
    if (unit === "m") {
      return value * 60 * 1000;
    }
    if (unit === "h") {
      return value * 60 * 60 * 1000;
    }

    return value * 24 * 60 * 60 * 1000;
  }
}
