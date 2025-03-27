import { ProblemMetadata, CodeTemplate } from './problem';

export class CodeWrapperService {
  static generateWrapper(
    userCode: string,
    language: string,
    metadata: ProblemMetadata,
    functionName: string
  ): string {
    switch (language) {
      case 'javascript':
        return this.generateJavaScriptWrapper(userCode, metadata, functionName);
      case 'python':
        return this.generatePythonWrapper(userCode, metadata, functionName);
      case 'cpp':
        return this.generateCppWrapper(userCode, metadata, functionName);
      case 'java':
        return this.generateJavaWrapper(userCode, metadata, functionName);
      default:
        return userCode;
    }
  }

  private static generateJavaScriptWrapper(
    userCode: string,
    metadata: ProblemMetadata,
    functionName: string
  ): string {
    return `
${userCode}

// Test case runner
const stdin = process.stdin;
let inputData = '';

stdin.on('data', (data) => {
    inputData += data.toString();
});

stdin.on('end', () => {
    const testCase = JSON.parse(inputData);
    const result = ${functionName}(${metadata.params.map(p => `testCase.${p.name}`).join(', ')});
    console.log(JSON.stringify(result));
});
`;
  }

  private static generatePythonWrapper(
    userCode: string,
    metadata: ProblemMetadata,
    functionName: string
  ): string {
    return `
  import json
  import sys
  
  ${userCode}
  
  # Test case runner
  input_data = sys.stdin.read()
  test_case = json.loads(input_data)
  result = ${functionName}(${metadata.params.map(p => `test_case["${p.name}"]`).join(', ')})
  print(json.dumps(result))
  `;
  }

  private static generateCppWrapper(
    userCode: string,
    metadata: ProblemMetadata,
    functionName: string
  ): string {
    return `
#include <iostream>
#include <vector>
#include <string>

${userCode}

int main() {
    std::string input_data;
    std::string line;
    while (std::getline(std::cin, line)) {
        input_data += line;
    }
    json test_case = json::parse(input_data);
    Solution solution;
    auto result = solution.${functionName}(${metadata.params.map(p => 
      `test_case["${p.name}"].get<${this.getCppType(p.type)}>()`).join(', ')});
    std::cout << json(result).dump() << std::endl;
    return 0;
}`;
  }

  private static generateJavaWrapper(
    userCode: string,
    metadata: ProblemMetadata,
    functionName: string
  ): string {
    return `
import java.util.Scanner;
import org.json.JSONObject;

${userCode}

class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        StringBuilder inputData = new StringBuilder();
        while (scanner.hasNextLine()) {
            inputData.append(scanner.nextLine());
        }
        String inputStr = inputData.toString();
        JSONObject testCase = new JSONObject(inputStr);
        Solution solution = new Solution();
        Object result = solution.${functionName}(${metadata.params.map(p => 
          `(${this.getJavaType(p.type)}) testCase.get("${p.name}")`).join(', ')});
        System.out.println(new JSONObject().put("result", result).toString());
    }
}
`;
  }

  private static getCppType(type: string): string {
    switch (type) {
      case 'number[]': return 'std::vector<int>';
      case 'string[]': return 'std::vector<std::string>';
      case 'number': return 'int';
      case 'string': return 'std::string';
      default: return 'auto';
    }
  }

  private static getJavaType(type: string): string {
    switch (type) {
      case 'number[]': return 'int[]';
      case 'string[]': return 'String[]';
      case 'number': return 'int';
      case 'string': return 'String';
      default: return 'Object';
    }
  }
}