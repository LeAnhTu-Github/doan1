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
    // Detect typing imports needed
    const typingTypes = [];
    if (/List\[/.test(userCode)) typingTypes.push("List");
    if (/Dict\[/.test(userCode)) typingTypes.push("Dict");
    if (/Optional\[/.test(userCode)) typingTypes.push("Optional");
  
    let importTyping = "";
    if (typingTypes.length > 0) {
      importTyping = `from typing import ${typingTypes.join(", ")}\n`;
    }
  
    // Normalize line endings and split user code into lines
    const lines = userCode.replace(/\r\n/g, '\n').split('\n');
  
    // Find the minimum indentation level of non-empty lines
    let minIndent = Infinity;
    for (const line of lines) {
      if (line.trim().length > 0) {
        const indent = line.match(/^\s*/)?.[0].length || 0;
        minIndent = Math.min(minIndent, indent);
      }
    }
  
    // Remove the minimum indentation from each line to normalize
    const normalizedLines = lines.map(line => {
      if (line.trim().length === 0) return line;
      return line.slice(minIndent);
    });
  
    // Add proper indentation (e.g., 4 spaces) for the wrapper
    const indentedUserCode = normalizedLines
      .map(line => line.length > 0 ? '    ' + line : line)
      .join('\n')
      .trim();
  
    const wrapper = `
  import json
  import sys
  ${importTyping}
  ${indentedUserCode}
  
  # Test case runner
  input_data = sys.stdin.read()
  test_case = json.loads(input_data)
  result = ${functionName}(${metadata.params.map(p => `test_case["${p.name}"]`).join(', ')})
  print(json.dumps(result))
  `;
  
    return wrapper.trim();
  }
  

  private static generateCppWrapper(
    userCode: string,
    metadata: ProblemMetadata,
    functionName: string
  ): string {
    if (userCode.includes('main')) {
      return userCode.replace(/[^\x20-\x7E\n\t]/g, '').replace(/\r\n/g, '\n').trim();
    }
  
    let includes = `#include <iostream>
  #include <vector>
  #include <string>
  using namespace std;
  `;
  
    if (userCode.includes('unordered_map')) {
      includes += `#include <unordered_map>\n`;
    }
  
    let inputParsing = '';
    let paramArgs = '';
    const params = metadata.params || [];
    params.forEach((param, index) => {
      if (param.type === 'number[]') {
        inputParsing += `
      int n${index};
      cin >> n${index};
      vector<int> param${index}(n${index});
      for (int i = 0; i < n${index}; ++i) {
          cin >> param${index}[i];
      }
  `;
      } else if (param.type === 'string[]') {
        inputParsing += `
      int n${index};
      cin >> n${index};
      vector<string> param${index}(n${index});
      for (int i = 0; i < n${index}; ++i) {
          cin >> param${index}[i];
      }
  `;
      } else if (param.type === 'number') {
        inputParsing += `
      int param${index};
      cin >> param${index};
  `;
      } else if (param.type === 'string') {
        inputParsing += `
      string param${index};
      cin >> param${index};
  `;
      }
      paramArgs += `param${index}${index < params.length - 1 ? ', ' : ''}`;
    });
  
    // Xác định kiểu trả về từ returnType
    const returnType = this.getCppType(metadata.returnType || 'auto');
  
    let outputFormatting = '';
    if (returnType === 'std::vector<int>') {
      outputFormatting = `
      cout << "[";
      for (size_t i = 0; i < result.size(); ++i) {
          cout << result[i];
          if (i < result.size() - 1) cout << ",";
      }
      cout << "]" << endl;
  `;
    } else if (returnType === 'std::vector<std::string>') {
      outputFormatting = `
      cout << "[";
      for (size_t i = 0; i < result.size(); ++i) {
          cout << "\\""<< result[i] <<"\\"";
          if (i < result.size() - 1) cout << ",";
      }
      cout << "]" << endl;
  `;
    } else {
      outputFormatting = `
     for (int num : result) {
    cout << num << " ";
}
cout << endl;
  `;
    }
  
    const wrapper = `
  ${includes}
  ${userCode}
  int main() {
  ${inputParsing}
      Solution solution;
      ${returnType} result = solution.${functionName}(${paramArgs});
  ${outputFormatting}
      return 0;
  }
  `;
  
    return wrapper.replace(/[^\x20-\x7E\n\t]/g, '').replace(/\r\n/g, '\n').trim();
  }
  
  private static generateJavaWrapper(
    userCode: string,
    metadata: ProblemMetadata,
    functionName: string
  ): string {
    if (userCode.includes('main')) {
      const cleanCode = userCode
        .replace(/[^\x20-\x7E\n\t]/g, '')
        .replace(/\r\n/g, '\n')
        .trim();
      return cleanCode;
    }
  
    const paramParsing = metadata.params.map((p, index) => {
      const javaType = this.getJavaType(p.type);
      if (javaType === 'int') {
        return `int param${index} = Integer.parseInt(valueMap.get("${p.name}"));`;
      }
      if (javaType === 'String') {
        return `String param${index} = valueMap.get("${p.name}");`;
      }
      if (javaType === 'int[]') {
        return `int[] param${index} = Arrays.stream(valueMap.get("${p.name}").replaceAll("[\\[\\]\\s]", "").split(",")).filter(s -> !s.isEmpty()).mapToInt(Integer::parseInt).toArray();`;
      }
      if (javaType === 'String[]') {
        return `String[] param${index} = valueMap.get("${p.name}").replaceAll("[\\[\\]\\s]", "").split(",");`;
      }
      return `Object param${index} = valueMap.get("${p.name}");`;
    }).join('\n        ');
  
    const wrapper = `
import java.util.*;
import java.util.stream.*;

${userCode}

class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String inputStr = scanner.nextLine();

        Map<String, String> valueMap = new HashMap<>();
        inputStr = inputStr.trim().replaceAll("[\\\\{\\\\}\\\"]", "");
        String[] pairs = inputStr.split(",");
        for (String pair : pairs) {
            String[] kv = pair.split(":", 2);
            if (kv.length == 2) {
                valueMap.put(kv[0].trim(), kv[1].trim());
            }
        }

        ${paramParsing}

        Solution solution = new Solution();
        Object result = solution.${functionName}(${metadata.params.map((_, index) => `param${index}`).join(', ')});
        System.out.println(result);
    }
}
  `;
  
    return wrapper.replace(/[^\x20-\x7E\n\t]/g, '').replace(/\r\n/g, '\n').trim();
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