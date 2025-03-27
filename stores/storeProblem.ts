import { PrismaClient, Problem } from "@prisma/client";
import { ProblemMetadata, CodeTemplate } from "@/lib/problem";
const prisma = new PrismaClient();

// Get all problems with optional filters
export const getAllProblems = async (
    category?: string,
    difficulty?: string
): Promise<Problem[]> => {
    try {
        const problems = await prisma.problem.findMany({
            where: {
                ...(category && { category }),
                ...(difficulty && { difficulty }),
            },
            include: {
                testCases: true,
                contestProblems: true,
                submissions: true,
            },
        });
        return problems;
    } catch (error) {
        console.error("Error fetching problems:", error);
        throw error;
    }
};

// Get single problem by ID
export const getProblemById = async (id: string): Promise<Problem | null> => {
    try {
        const problem = await prisma.problem.findUnique({
            where: { id },
            include: {
                testCases: true,
                contestProblems: true,
                submissions: true,
            },
        });
        return problem;
    } catch (error) {
        console.error("Error fetching problem:", error);
        throw error;
    }
};

// Create new problem
export const createProblem = async (data: {
    title?: string;
    difficulty?: string;
    category?: string;
    language?: number;
    time?: Date | string;
    order?: number;
    problemStatement: string;
    examples: any;
    constraints: string;
    status?: boolean;
    metadata: Record<string, any>;
    codeTemplate: Record<string, any>;
    functionName: string;
    testCases?: {
        input: Record<string, any> | any;
        expected: string;
        isHidden?: boolean;
    }[];
}): Promise<Problem> => {
    try {
        const problem = await prisma.problem.create({
            data: {
                title: data.title,
                difficulty: data.difficulty,
                category: data.category,
                language: data.language,
                time: data.time ? new Date(data.time) : undefined,
                order: data.order,
                problemStatement: data.problemStatement,
                examples: data.examples,
                constraints: data.constraints,
                status: data.status,
                metadata: data.metadata,
                codeTemplate: data.codeTemplate,
                functionName: data.functionName,
                testCases: {
                    create: data.testCases || [],
                },
            },
        });
        return problem;
    } catch (error) {
        console.error("Error creating problem:", error);
        throw error;
    }
};

// Update problem
export const updateProblem = async (
    id: string,
    data: Partial<{
        title: string;
        difficulty: string;
        category: string;
        language: number;
        time: Date | string;
        order: number;
        problemStatement: string;
        examples: any;
        constraints: string;
        status: boolean;
        metadata: Record<string, any>;
        codeTemplate: Record<string, any>;
        functionName: string;
        testCases: {
            input: Record<string, any> | any;
            expected: string;
            isHidden?: boolean;
        }[];
    }>
): Promise<Problem> => {
    try {
        const problem = await prisma.problem.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.difficulty && { difficulty: data.difficulty }),
                ...(data.category && { category: data.category }),
                ...(data.language && { language: data.language }),
                ...(data.time && { time: new Date(data.time) }),
                ...(data.order && { order: data.order }),
                ...(data.problemStatement && { problemStatement: data.problemStatement }),
                ...(data.examples && { examples: data.examples }),
                ...(data.constraints && { constraints: data.constraints }),
                ...(data.status !== undefined && { status: data.status }),
                ...(data.metadata && { metadata: data.metadata }),
                ...(data.codeTemplate && { codeTemplate: data.codeTemplate }),
                ...(data.functionName && { functionName: data.functionName }),
                ...(data.testCases && {
                    testCases: {
                        deleteMany: {},
                        create: data.testCases,
                    },
                }),
            },
        });
        return problem;
    } catch (error) {
        console.error("Error updating problem:", error);
        throw error;
    }
};

// Delete problem
export const deleteProblem = async (id: string): Promise<Problem> => {
    try {
        const problem = await prisma.problem.delete({
            where: { id },
        });
        return problem;
    } catch (error) {
        console.error("Error deleting problem:", error);
        throw error;
    }
};

// Cleanup function to disconnect Prisma
export const disconnect = async () => {
    await prisma.$disconnect();
};