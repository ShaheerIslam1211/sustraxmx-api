/**
 * Clipboard Utilities
 * 
 * This file contains utilities for clipboard operations with proper error handling
 * and user feedback integration.
 */

import { message } from 'antd';

// Types
export interface ClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
  showNotification?: boolean;
}

/**
 * Copy text to clipboard with optional user feedback
 */
export const copyToClipboard = async (
  text: string, 
  options: ClipboardOptions = {}
): Promise<boolean> => {
  const {
    successMessage = 'Copied to clipboard!',
    errorMessage = 'Failed to copy to clipboard',
    showNotification = true,
  } = options;

  try {
    // Check if clipboard API is available
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not available');
    }

    await navigator.clipboard.writeText(text);
    
    if (showNotification && successMessage) {
      message.success(successMessage);
    }
    
    return true;
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    
    // Fallback method for older browsers
    try {
      const success = fallbackCopyToClipboard(text);
      if (success) {
        if (showNotification && successMessage) {
          message.success(successMessage);
        }
        return true;
      }
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
    }
    
    if (showNotification && errorMessage) {
      message.error(errorMessage);
    }
    
    return false;
  }
};

/**
 * Fallback method for copying text (for older browsers)
 */
const fallbackCopyToClipboard = (text: string): boolean => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // Make the textarea invisible
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    document.body.removeChild(textArea);
    throw error;
  }
};

/**
 * Read text from clipboard
 */
export const readFromClipboard = async (): Promise<string | null> => {
  try {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not available');
    }
    
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('Clipboard read failed:', error);
    return null;
  }
};

/**
 * Check if clipboard API is supported
 */
export const isClipboardSupported = (): boolean => {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
};

/**
 * Copy formatted code with syntax highlighting info
 */
export const copyCode = async (
  code: string, 
  language?: string,
  options: ClipboardOptions = {}
): Promise<boolean> => {
  const formattedCode = language ? `// ${language.toUpperCase()}\n${code}` : code;
  
  return copyToClipboard(formattedCode, {
    successMessage: `${language ? language.toUpperCase() + ' ' : ''}code copied to clipboard!`,
    ...options,
  });
};

/**
 * Copy JSON data with formatting
 */
export const copyJson = async (
  data: any, 
  options: ClipboardOptions = {}
): Promise<boolean> => {
  try {
    const formattedJson = JSON.stringify(data, null, 2);
    
    return copyToClipboard(formattedJson, {
      successMessage: 'JSON copied to clipboard!',
      ...options,
    });
  } catch (error) {
    console.error('JSON stringify failed:', error);
    
    if (options.showNotification !== false) {
      message.error('Failed to format JSON for copying');
    }
    
    return false;
  }
};

/**
 * Copy URL with validation
 */
export const copyUrl = async (
  url: string, 
  options: ClipboardOptions = {}
): Promise<boolean> => {
  try {
    // Validate URL
    new URL(url);
    
    return copyToClipboard(url, {
      successMessage: 'URL copied to clipboard!',
      ...options,
    });
  } catch (error) {
    console.error('Invalid URL:', error);
    
    if (options.showNotification !== false) {
      message.error('Invalid URL format');
    }
    
    return false;
  }
};

/**
 * Utility object with common clipboard operations
 */
export const clipboard = {
  copy: copyToClipboard,
  read: readFromClipboard,
  isSupported: isClipboardSupported,
  copyCode,
  copyJson,
  copyUrl,
};