import { Buffer } from "buffer"; // Nếu dùng Node.js, hoặc dùng global Buffer nếu có

const JUDGE0_HOST = "uneti.ngrok.app";
const JUDGE0_PROTOCOL = "https";

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
  returnType?: string;
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
    const languageId = request.language_id;
    // Gửi base64 cho cả C++ và Python
    const useBase64 = languageId === languageMap.cpp || languageId === languageMap.python;

    const body = { ...request };
    if (useBase64) {
      body.source_code = Buffer.from(request.source_code).toString("base64");
      if (body.stdin) {
        body.stdin = Buffer.from(body.stdin).toString("base64");
      }
    }

    const response = await fetch(
      `${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/submissions?base64_encoded=${useBase64}&wait=false`,
      {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Gửi mã nguồn thất bại: ${response.statusText}`);
    }

    const data: SubmissionResponse = await response.json();
    return data.token;
  } catch (error) {
    console.error('Lỗi gửi mã nguồn:', error);
    throw error;
  }
}

export async function getSubmissionResult(token: string): Promise<Judge0Result> {
  try {
    // Với C++, cần xử lý kết quả trả về dạng base64
    // Kiểm tra token để xác định có phải là bài C++ không
    // Đây chỉ là heuristic đơn giản - thực tế nên lưu languageId cùng token hoặc dùng cách khác chắc chắn hơn
    const isCppSubmission = token.startsWith('cpp_') || token.includes('cpp');
    const useBase64 = isCppSubmission;
    
    const response = await fetch(
      `${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/submissions/${token}?base64_encoded=${useBase64}`, 
      { headers: apiHeaders }
    );

    if (!response.ok) {
      throw new Error(`Lấy kết quả thất bại: ${response.statusText}`);
    }

    const result: Judge0Result = await response.json();
    console.log('Judge0 result:', result);
    return result;
  } catch (error) {
    throw new Error(`Lỗi lấy kết quả: ${error instanceof Error ? error.message : "Không rõ lỗi"}`);
  }
}

function decodeBase64(str?: string) {
  if (!str) return "";
  // Node.js hoặc trình duyệt hiện đại đều hỗ trợ atob/btoa hoặc Buffer
  try {
    if (typeof window !== "undefined" && window.atob) {
      // Trình duyệt
      return decodeURIComponent(escape(window.atob(str)));
    } else {
      // Node.js
      return Buffer.from(str, "base64").toString("utf-8");
    }
  } catch {
    return str;
  }
}

export async function executeCode(request: SubmissionRequest): Promise<string> {
  try {
    const languageId = request.language_id;
    const useBase64 = languageId === languageMap.cpp || languageId === languageMap.python;

    const body = { ...request };
    if (useBase64) {
      body.source_code = Buffer.from(request.source_code).toString("base64");
      if (body.stdin) {
        body.stdin = Buffer.from(body.stdin).toString("base64");
      }
    }
    // KHÔNG mã hóa body.stdin!

    // Log để debug
    console.log("DEBUG: body gửi lên Judge0:", body);

    const url = `${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/submissions?base64_encoded=${useBase64}&wait=true`;

    const response = await fetch(url, {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Nội dung lỗi trả về:', errorText);
      throw new Error(`Thực thi mã nguồn thất bại: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const result: Judge0Result = await response.json();
    const isBase64 = languageId === languageMap.cpp || languageId === languageMap.python;

    // Giải mã nếu là base64
    const stdout = isBase64 ? decodeBase64(result.stdout) : result.stdout;
    const stderr = isBase64 ? decodeBase64(result.stderr) : result.stderr;
    const compile_output = isBase64 ? decodeBase64(result.compile_output) : result.compile_output;

    console.log('Judge0 result:', { ...result, stdout, stderr, compile_output });

    if (stderr) {
      console.error('Lỗi khi chạy chương trình:', stderr);
      return `Lỗi khi chạy chương trình: ${stderr}`;
    }

    if (compile_output) {
      console.error('Lỗi biên dịch:', compile_output);
      return `Lỗi biên dịch: ${compile_output}`;
    }

    if (!stdout && !stderr && !compile_output) {
      console.warn('Không có kết quả trả về từ Judge0');
      return "Không có kết quả trả về từ Judge0";
    }

    return stdout || "Không có đầu ra";
  } catch (error) {
    console.error('Chi tiết lỗi thực thi:', {
      name: error instanceof Error ? error.name : 'Không rõ loại lỗi',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof Error) {
      return `Lỗi: ${error.message}`;
    }
    return "Đã xảy ra lỗi không xác định khi thực thi";
  }
}

// Thêm hàm kiểm tra health của Judge0
export async function checkJudge0Health(): Promise<boolean> {
  try {
    const response = await fetch(`${JUDGE0_PROTOCOL}://${JUDGE0_HOST}/health`, {
      headers: apiHeaders
    });
    
    console.log('Kết quả kiểm tra health:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lỗi khi kiểm tra health:', errorText);
    }

    return response.ok;
  } catch (error) {
    console.error('Lỗi kiểm tra health:', {
      name: error instanceof Error ? error.name : 'Không rõ loại lỗi',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
}



