const JUDGE0_HOST = "localhost:2358";
const JUDGE0_PROTOCOL = "http";

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
  "Accept": "application/json"
};

export async function submitCode(request: SubmissionRequest): Promise<string> {
  try {
    const response = await fetch(`${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/submissions?base64_encoded=false&wait=false`, {
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
    console.error('Submit code error:', error);
    throw error;
  }
}

export async function getSubmissionResult(token: string): Promise<Judge0Result> {
  try {
    const response = await fetch(
      `${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/submissions/${token}?base64_encoded=false`, 
      { headers: apiHeaders }
    );

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
    const url = `${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/submissions?base64_encoded=false&wait=true`;

    const response = await fetch(url, {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Failed to execute code: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const result: Judge0Result = await response.json();
    if (result.stderr) {
      console.error('Runtime error:', result.stderr);
      return `Runtime Error: ${result.stderr}`;
    }

    if (result.compile_output) {
      console.error('Compilation error:', result.compile_output);
      return `Compilation Error: ${result.compile_output}`;
    }

    if (!result.stdout && !result.stderr && !result.compile_output) {
      console.warn('No output received from Judge0');
      return "No output received from the judge";
    }

    return result.stdout || "No output";
  } catch (error) {
    console.error('Detailed execution error:', {
      name: error instanceof Error ? error.name : 'Unknown error type',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "Unknown execution error occurred";
  }
}

// Thêm hàm kiểm tra health của Judge0
export async function checkJudge0Health(): Promise<boolean> {
  try {
    const response = await fetch(`${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/health`, {
      headers: apiHeaders
    });
    
    console.log('Health check response:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Health check error response:', errorText);
    }

    return response.ok;
  } catch (error) {
    console.error('Health check error:', {
      name: error instanceof Error ? error.name : 'Unknown error type',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}



