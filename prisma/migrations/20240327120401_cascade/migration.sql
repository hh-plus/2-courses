-- DropForeignKey
ALTER TABLE "CourseUser" DROP CONSTRAINT "CourseUser_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseUser" DROP CONSTRAINT "CourseUser_userId_fkey";

-- AddForeignKey
ALTER TABLE "CourseUser" ADD CONSTRAINT "CourseUser_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseUser" ADD CONSTRAINT "CourseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
