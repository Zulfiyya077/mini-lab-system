-- CreateTable
CREATE TABLE "analysis_files" (
    "id" SERIAL NOT NULL,
    "analysis_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storage_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "analysis_files" ADD CONSTRAINT "analysis_files_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
