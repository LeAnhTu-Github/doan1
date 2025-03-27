export interface ProblemMetadata {
	params: {
	  name: string;
	  type: 'number' | 'number[]' | 'string' | 'string[]' | 'TreeNode' | 'ListNode';
	  description?: string;
	}[];
	return: {
	  type: 'number' | 'number[]' | 'string' | 'string[]' | 'boolean' | 'void';
	  description?: string;
	};
  }
  
  export interface CodeTemplate {
	javascript: string;
	python: string;
	cpp: string;
	java: string;
  }