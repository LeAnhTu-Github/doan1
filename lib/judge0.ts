// const JUDGE0_API_KEY = "f7449f873emsheb1b3cbf84504a2p1245d0jsn6d020d932ea1";
const JUDGE0_API_KEY = "7509d67599msha5b7e42242637b7p1c66d2jsn366cb2687f6e";
const JUDGE0_HOST = "judge0-ce.p.rapidapi.com";

export const languageMap = {
  javascript: 63,
  python: 71,
  cpp: 52,
  java: 62,
  csharp: 51,
};

export interface ProblemMetadata {
  inputFormat: {
    type: 'single' | 'multiple';
    params: {
      name: string;
      type: 'number' | 'array' | 'string' | 'matrix' | 'tree' | 'linkedlist';
      elementType?: 'number' | 'string' | 'boolean';  // for arrays/matrix
    }[];
  };
  outputFormat: {
    type: 'number' | 'array' | 'string' | 'boolean';
    elementType?: 'number' | 'string' | 'boolean';  // for arrays
  };
}
export interface SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
}

export interface SubmissionResponse {
  token: string;
}

export interface Judge0Result {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  status?: {
    id: number;
    description: string;
  };
}

const apiHeaders = {
  "Content-Type": "application/json",
  "X-RapidAPI-Key": JUDGE0_API_KEY,
  "X-RapidAPI-Host": JUDGE0_HOST,
};

export async function submitCode(request: SubmissionRequest): Promise<string> {
  try {
    const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions", {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit code: ${response.statusText}`);
    }

    const data: SubmissionResponse = await response.json();
    return data.token;
  } catch (error) {
    throw new Error(`Submission error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function getSubmissionResult(token: string): Promise<Judge0Result> {
  try {
    const response = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
      headers: apiHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to get result: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Result fetch error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function executeCode(request: SubmissionRequest): Promise<string> {
  try {
    // Gửi code lên Judge0
    const token = await submitCode(request);

    // Đợi và lấy kết quả
    let result: Judge0Result;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await getSubmissionResult(token);
    } while (result.status?.id === 1 || result.status?.id === 2); // 1: Queued, 2: Processing

    // Trả về output hoặc error message
    return result.stdout || result.stderr || result.compile_output || "Unknown error";
  } catch (error) {
    throw new Error(`Execution error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}


