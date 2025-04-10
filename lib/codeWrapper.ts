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
    // Đảm bảo userCode không có thụt lề không mong muốn
    const cleanUserCode = userCode
      .split('\n')
      .map(line => line.trimStart()) // Loại bỏ khoảng trắng đầu dòng
      .join('\n')
      .trim();
  
    const wrapper = `
  import json
  import sys
  
  ${cleanUserCode}
  
  # Test case runner
  input_data = sys.stdin.read()
  test_case = json.loads(input_data)
  result = ${functionName}(${metadata.params.map(p => `test_case["${p.name}"]`).join(', ')})
  print(json.dumps(result))
  `;
  
    // Loại bỏ khoảng trắng thừa và đảm bảo không có thụt lề ở cấp cao nhất
    const cleanWrapper = wrapper
      .split('\n')
      .map(line => line.trimStart()) // Loại bỏ khoảng trắng đầu dòng
      .join('\n')
      .trim();
  
    return cleanWrapper;
  }
  

  private static generateCppWrapper(
    userCode: string,
    metadata: ProblemMetadata,
    functionName: string
  ): string {
    // Nếu userCode đã chứa main(), không thêm wrapper
    if (userCode.includes('main')) {
      const cleanCode = userCode
        .replace(/[^\x20-\x7E\n\t]/g, '')
        .replace(/\r\n/g, '\n')
        .trim();
      console.log('Cleaned user code:\n', cleanCode);
      console.log('Hex dump:\n', Buffer.from(cleanCode).toString('hex'));
      return cleanCode;
    }
  
    const wrapper = `
  #include <iostream>
  #include <vector>
  #include <string>
  #include <sstream>
  #include <nlohmann/json.hpp>
  
  using json = nlohmann::json;
  
  ${userCode}
  
  int main() {
      std::string input;
      std::string line;
      while (std::getline(std::cin, line)) {
          input += line;
      }
      
      json test_case;
      try {
          test_case = json::parse(input);
      } catch (const json::parse_error& e) {
          std::cerr << "JSON parse error: " << e.what() << std::endl;
          return 1;
      }
      
      ${metadata.params.map((p, index) => {
        const cppType = this.getCppType(p.type);
        return `${cppType} param${index} = test_case["${p.name}"].get<${cppType}>();`;
      }).join('\n    ')}
      
      Solution solution;
      auto result = solution.${functionName}(${metadata.params.map((_, index) => `param${index}`).join(', ')});
      
      json output;
      output["result"] = result;
      std::cout << output.dump() << std::endl;
      
      return 0;
  }`;
  
    const cleanWrapper = wrapper
      .replace(/[^\x20-\x7E\n\t]/g, '')
      .replace(/\r\n/g, '\n')
      .trim();
    console.log('Cleaned wrapper:\n', cleanWrapper);
    console.log('Hex dump:\n', Buffer.from(cleanWrapper).toString('hex'));
    return cleanWrapper;
  }
  private static generateJavaWrapper(
    userCode: string,
    metadata: ProblemMetadata,
    functionName: string
  ): string {
    // Nếu userCode đã chứa main, trả về code sạch
    if (userCode.includes('main')) {
      const cleanCode = userCode
        .replace(/[^\x20-\x7E\n\t]/g, '')
        .replace(/\r\n/g, '\n')
        .trim();
      return cleanCode;
    }
  
    const wrapper = `
  import java.util.Scanner;
  
  ${userCode}
  
  class Main {
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          String inputStr = scanner.nextLine();
          
          // Parse JSON thủ công cho trường hợp {"x": số}
          String valueStr = inputStr.substring(inputStr.indexOf(":") + 1, inputStr.lastIndexOf("}")).trim();
          ${metadata.params.map((p, index) => {
            const javaType = this.getJavaType(p.type);
            return `${javaType} param${index} = ${javaType === 'int' ? 'Integer.parseInt(valueStr)' : 'valueStr'};`;
          }).join('\n        ')}
          
          Solution solution = new Solution();
          Object result = solution.${functionName}(${metadata.params.map((_, index) => `param${index}`).join(', ')});
          System.out.println(result);
      }
  }
  `;
  
    const cleanWrapper = wrapper
      .replace(/[^\x20-\x7E\n\t]/g, '')
      .replace(/\r\n/g, '\n')
      .trim();
    
    return cleanWrapper;
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