DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'UserRole' AND e.enumlabel = 'b2b_customer'
  ) THEN
    ALTER TYPE "UserRole" ADD VALUE 'b2b_customer';
  END IF;
END $$;

ALTER TABLE "AppUser"
  ADD COLUMN IF NOT EXISTS "customerId" TEXT,
  ADD COLUMN IF NOT EXISTS "refreshTokenHash" TEXT,
  ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" TIMESTAMP(3);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'AppUser_customerId_fkey'
  ) THEN
    ALTER TABLE "AppUser"
      ADD CONSTRAINT "AppUser_customerId_fkey"
      FOREIGN KEY ("customerId") REFERENCES "Customer"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "AppUser_customerId_key" ON "AppUser"("customerId");
