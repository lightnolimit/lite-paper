import { documentationTree as sharedDocumentationTree } from '../../shared/documentation-config.js';
import type { FileItem } from '../types/documentation';

export const documentationTree: FileItem[] = sharedDocumentationTree;

// Documentation content - empty object for migration to individual markdown files
export const documentationContent: Record<string, string> = {};
