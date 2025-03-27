import { PrismaClient } from "@prisma/client";
import { TestCase } from "@prisma/client";
const prisma = new PrismaClient();


export const getTestCaseById = async (problemId: string) => {
    try {
        const testCases: TestCase[] = await prisma.testCase.findMany({
            where: { problemId },
        });
        return testCases;
    } catch (error) {
        console.error("Error fetching test cases:", error);
        throw error;
    }
};