import { UserRole } from "../../../modules/auth/domain/user-role.enum";

export interface AuthUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  customerId: string | null;
  refreshTokenHash: string | null;
  refreshTokenExpiresAt: Date | null;
  isActive: boolean;
}

export const AUTH_REPOSITORY = Symbol("AUTH_REPOSITORY");

export interface AuthRepository {
  findActiveUserByEmail(email: string): Promise<AuthUserRecord | null>;
  findActiveUserById(id: string): Promise<AuthUserRecord | null>;
  createCustomerUser(input: {
    email: string;
    passwordHash: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    customerType: "b2c" | "b2b";
    isWholesaler: boolean;
  }): Promise<AuthUserRecord>;
  updateRefreshToken(input: {
    userId: string;
    refreshTokenHash: string | null;
    refreshTokenExpiresAt: Date | null;
  }): Promise<void>;
}
