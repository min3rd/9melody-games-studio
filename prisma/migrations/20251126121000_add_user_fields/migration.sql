-- Add username and password_hash columns to the User table (post-migration)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "username" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password_hash" TEXT;

-- Add unique index for username if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'User_username_key'
  ) THEN
    CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
  END IF;
END$$;
