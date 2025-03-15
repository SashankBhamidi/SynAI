import { Conversation, Message, AIModel } from "@/types";
import { logger } from "./logger";

// Storage keys
const CONVERSATIONS_KEY = 'synthesis-ai-conversations';
const MESSAGES_KEY_PREFIX = 'synthesis-ai-messages-';
const CURRENT_CONVERSATION_KEY = 'synthesis-ai-current-conversation';

// Event names for real-time updates
export const CONVERSATION_EVENTS = {
  CREATED: 'conversation-created',
  UPDATED: 'conversation-updated',
  DELETED: 'conversation-deleted',
  SWITCHED: 'conversation-switched',
  CLEARED: 'conversations-cleared'
} as const;

/**
 * Helper function to dispatch conversation events for real-time updates
 * @param eventType - The type of event to dispatch
 * @param conversationId - Optional conversation ID associated with the event
 * @param data - Optional additional data to include with the event
 */
const dispatchConversationEvent = (eventType: string, conversationId?: string, data?: unknown): void => {
  try {
    window.dispatchEvent(new CustomEvent(eventType, { 
      detail: { conversationId, data } 
    }));
  } catch (error) {
    logger.error('Failed to dispatch conversation event:', eventType, error);
  }
};

/**
 * Enhanced conversation interface with additional metadata for storage
 */
interface StoredConversation extends Conversation {
  messageCount: number;
  lastMessageAt?: Date;
  lastMessage?: string;
}

/**
 * Retrieves all conversations from localStorage
 * @returns Array of conversations sorted by updatedAt (newest first), or empty array if none exist or on error
 */
export const getConversations = (): Conversation[] => {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (!stored) {
      logger.debug('No conversations found in storage');
      return [];
    }
    
    const conversations = JSON.parse(stored);
    const parsedConversations = conversations.map((conv: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      lastMessageAt?: string;
      folderId?: string;
      tags?: string[];
      isFavorite?: boolean;
      isPinned?: boolean;
      description?: string;
      color?: string;
    }) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      lastMessageAt: conv.lastMessageAt ? new Date(conv.lastMessageAt) : undefined
    })).sort((a, b) => {
      // Pinned conversations first, then by updatedAt
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    logger.debug(`Loaded ${parsedConversations.length} conversations from storage`);
    return parsedConversations;
  } catch (error) {
    logger.error('Failed to load conversations from storage:', error);
    return [];
  }
};

/**
 * Retrieves all messages for a specific conversation
 * @param conversationId - The unique identifier of the conversation
 * @returns Array of messages for the conversation, or empty array if none exist or on error
 */
export const getConversationMessages = (conversationId: string): Message[] => {
  try {
    if (!conversationId) {
      logger.warn('getConversationMessages called with invalid conversationId');
      return [];
    }

    const stored = localStorage.getItem(`${MESSAGES_KEY_PREFIX}${conversationId}`);
    if (!stored) {
      logger.debug(`No messages found for conversation: ${conversationId}`);
      return [];
    }
    
    const messages = JSON.parse(stored);
    const parsedMessages = messages.map((msg: {
      id: string;
      role: string;
      content: string;
      timestamp: string;
      model?: AIModel;
      regenerationCount?: number;
    }) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    
    logger.debug(`Loaded ${parsedMessages.length} messages for conversation: ${conversationId}`);
    return parsedMessages;
  } catch (error) {
    logger.error(`Failed to load messages for conversation ${conversationId}:`, error);
    return [];
  }
};

/**
 * Creates a new conversation and sets it as the current conversation
 * @param initialMessage - Optional initial message to generate a title from
 * @returns The newly created conversation object
 * @throws Error if conversation creation fails
 */
export const createConversation = (initialMessage?: string): Conversation => {
  try {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: initialMessage ? generateConversationTitle(initialMessage) : "New conversation",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save to conversations list
    const conversations = getConversations();
    conversations.unshift(newConversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    
    // Set as current conversation
    setCurrentConversation(newConversation.id);
    
    logger.info(`Created new conversation: "${newConversation.title}" (${newConversation.id})`);
    dispatchConversationEvent(CONVERSATION_EVENTS.CREATED, newConversation.id, newConversation);
    
    return newConversation;
  } catch (error) {
    logger.error('Failed to create new conversation:', error);
    throw new Error('Failed to create conversation');
  }
};

/**
 * Saves a conversation along with its messages to localStorage
 * @param conversation - The conversation object to save
 * @param messages - Array of messages associated with the conversation
 * @throws Error if saving fails
 */
export const saveConversation = (conversation: Conversation, messages: Message[]): void => {
  try {
    if (!conversation?.id) {
      throw new Error('Invalid conversation: missing ID');
    }

    const conversations = getConversations();
    const existingIndex = conversations.findIndex(c => c.id === conversation.id);
    
    // Calculate conversation metadata
    const lastMessage = messages[messages.length - 1];
    const updatedConversation: StoredConversation = {
      ...conversation,
      updatedAt: new Date(),
      messageCount: messages.length,
      lastMessageAt: lastMessage?.timestamp,
      lastMessage: lastMessage?.content ? String(lastMessage.content).substring(0, 100) : undefined
    };
    
    // Update title if it's still default and we have messages
    if (conversation.title === "New conversation" && messages.length > 0) {
      const firstUserMsg = messages.find(m => m.role === "user");
      if (firstUserMsg && firstUserMsg.content) {
        updatedConversation.title = generateConversationTitle(String(firstUserMsg.content));
      }
    }
    
    // Update conversations list
    if (existingIndex >= 0) {
      conversations[existingIndex] = updatedConversation;
    } else {
      conversations.unshift(updatedConversation);
    }
    
    // Sort by updatedAt with pinned conversations first
    conversations.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    localStorage.setItem(`${MESSAGES_KEY_PREFIX}${conversation.id}`, JSON.stringify(messages));
    
    dispatchConversationEvent(CONVERSATION_EVENTS.UPDATED, conversation.id, updatedConversation);
    logger.info(`Saved conversation "${updatedConversation.title}" with ${messages.length} messages`);
  } catch (error) {
    logger.error('Failed to save conversation:', error);
    throw error;
  }
};

/**
 * Deletes a conversation and all its associated messages
 * @param conversationId - The unique identifier of the conversation to delete
 * @returns The ID of the new current conversation if the deleted one was current, null otherwise
 */
export const deleteConversation = (conversationId: string): string | null => {
  try {
    if (!conversationId) {
      logger.warn('deleteConversation called with invalid conversationId');
      return null;
    }

    const conversations = getConversations();
    const conversationToDelete = conversations.find(c => c.id === conversationId);
    
    if (!conversationToDelete) {
      logger.warn(`Conversation not found for deletion: ${conversationId}`);
      return null;
    }

    const filtered = conversations.filter(c => c.id !== conversationId);
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
    localStorage.removeItem(`${MESSAGES_KEY_PREFIX}${conversationId}`);
    
    // If this was the current conversation, switch to another one
    const current = getCurrentConversation();
    let newCurrentId: string | null = null;
    
    if (current === conversationId) {
      if (filtered.length > 0) {
        newCurrentId = filtered[0].id;
        setCurrentConversation(newCurrentId);
      } else {
        localStorage.removeItem(CURRENT_CONVERSATION_KEY);
      }
    }
    
    dispatchConversationEvent(CONVERSATION_EVENTS.DELETED, conversationId, { newCurrentId });
    logger.info(`Deleted conversation: "${conversationToDelete.title}" (${conversationId})`);
    
    return newCurrentId;
  } catch (error) {
    logger.error('Failed to delete conversation:', error);
    return null;
  }
};

/**
 * Deletes all conversations and their associated messages from storage
 * This action cannot be undone
 */
export const deleteAllConversations = (): void => {
  try {
    const conversations = getConversations();
    const conversationCount = conversations.length;
    
    // Remove all conversation messages
    conversations.forEach(conv => {
      localStorage.removeItem(`${MESSAGES_KEY_PREFIX}${conv.id}`);
    });
    
    // Clear conversations list and current conversation
    localStorage.removeItem(CONVERSATIONS_KEY);
    localStorage.removeItem(CURRENT_CONVERSATION_KEY);
    
    dispatchConversationEvent(CONVERSATION_EVENTS.CLEARED);
    logger.info(`Deleted all conversations (${conversationCount} total)`);
  } catch (error) {
    logger.error('Failed to delete all conversations:', error);
    throw error;
  }
};

/**
 * Renames a conversation with a new title
 * @param conversationId - The unique identifier of the conversation to rename
 * @param newTitle - The new title for the conversation
 * @throws Error if the conversation is not found or renaming fails
 */
export const renameConversation = (conversationId: string, newTitle: string): void => {
  try {
    if (!conversationId || !newTitle?.trim()) {
      throw new Error('Invalid parameters: conversationId and newTitle are required');
    }

    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const oldTitle = conversation.title;
    conversation.title = newTitle.trim();
    conversation.updatedAt = new Date();
    
    // Sort by updatedAt with pinned conversations first
    conversations.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    dispatchConversationEvent(CONVERSATION_EVENTS.UPDATED, conversationId, conversation);
    logger.info(`Renamed conversation from "${oldTitle}" to "${newTitle}" (${conversationId})`);
  } catch (error) {
    logger.error('Failed to rename conversation:', error);
    throw error;
  }
};

/**
 * Retrieves the ID of the currently active conversation
 * @returns The current conversation ID, or null if none is set
 */
export const getCurrentConversation = (): string | null => {
  try {
    const currentId = localStorage.getItem(CURRENT_CONVERSATION_KEY);
    logger.debug('Current conversation ID:', currentId || 'none');
    return currentId;
  } catch (error) {
    logger.error('Failed to get current conversation:', error);
    return null;
  }
};

/**
 * Sets the current active conversation
 * @param conversationId - The unique identifier of the conversation to set as current
 * @throws Error if conversationId is invalid or setting fails
 */
export const setCurrentConversation = (conversationId: string): void => {
  try {
    if (!conversationId) {
      throw new Error('Invalid conversationId: cannot be empty');
    }

    const previousId = getCurrentConversation();
    localStorage.setItem(CURRENT_CONVERSATION_KEY, conversationId);
    
    if (previousId !== conversationId) {
      dispatchConversationEvent(CONVERSATION_EVENTS.SWITCHED, conversationId, { previousId });
      logger.info(`Switched conversation from ${previousId || 'none'} to ${conversationId}`);
    }
  } catch (error) {
    logger.error('Failed to set current conversation:', error);
    throw error;
  }
};

/**
 * Gets the current conversation or creates a new one if none exists
 * @param initialMessage - Optional initial message to generate a title from if creating new conversation
 * @returns Object containing the conversation and whether it was newly created
 */
export const getOrCreateConversation = (initialMessage?: string): { conversation: Conversation, isNew: boolean } => {
  try {
    const currentId = getCurrentConversation();
    
    if (currentId) {
      const conversations = getConversations();
      const existing = conversations.find(c => c.id === currentId);
      if (existing) {
        logger.debug(`Using existing conversation: "${existing.title}" (${existing.id})`);
        return { conversation: existing, isNew: false };
      } else {
        logger.warn(`Current conversation ID ${currentId} not found in storage, creating new conversation`);
      }
    }
    
    // Create new conversation
    const newConversation = createConversation(initialMessage);
    return { conversation: newConversation, isNew: true };
  } catch (error) {
    logger.error('Failed to get or create conversation:', error);
    // Fallback: create a new conversation
    const fallbackConversation = createConversation(initialMessage);
    return { conversation: fallbackConversation, isNew: true };
  }
};

/**
 * Generates a conversation title from a message by cleaning and truncating it
 * @param message - The message content to generate a title from
 * @returns A cleaned, truncated title suitable for display
 */
export const generateConversationTitle = (message: string): string => {
  try {
    if (!message || typeof message !== 'string') {
      logger.warn('Invalid message provided for title generation');
      return 'New Chat';
    }

    // Clean up the message
    let title = message
      .replace(/[#*`_~[\]()]/g, '') // Remove markdown
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Remove common question/command starters
    title = title.replace(/^(please\s+|can\s+you\s+|could\s+you\s+|help\s+me\s+|i\s+need\s+|i\s+want\s+|i\s+would\s+like\s+|how\s+do\s+i\s+|how\s+to\s+|what\s+is\s+|what\s+are\s+|tell\s+me\s+|explain\s+|show\s+me\s+)/i, '');
    
    // Capitalize first letter
    if (title.length > 0) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }
    
    // Truncate to 30 characters max (ChatGPT style)
    if (title.length > 30) {
      title = title.substring(0, 30);
      // Find last complete word
      const lastSpace = title.lastIndexOf(' ');
      if (lastSpace > 15) {
        title = title.substring(0, lastSpace);
      }
    }
    
    // Remove trailing punctuation
    title = title.replace(/[.!?,:;]+$/, '');
    
    // Fallback if title is too short
    if (!title || title.length < 3) {
      title = 'New Chat';
    }
    
    logger.debug(`Generated title: "${title}" from message: "${message.substring(0, 50)}..."`);
    return title;
  } catch (error) {
    logger.error('Failed to generate conversation title:', error);
    return 'New Chat';
  }
};

/**
 * Exports all conversations and their messages to a JSON file
 * Creates a downloadable file containing all conversation data
 * @throws Error if export fails
 */
export const exportConversations = (): void => {
  try {
    const conversations = getConversations();
    if (conversations.length === 0) {
      logger.warn('No conversations to export');
      return;
    }

    const exportData = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      conversations: conversations,
      messages: {} as Record<string, Message[]>,
      metadata: {
        totalConversations: conversations.length,
        totalMessages: 0
      }
    };
    
    // Get all messages for each conversation
    let totalMessages = 0;
    conversations.forEach(conv => {
      try {
        const messages = getConversationMessages(conv.id);
        exportData.messages[conv.id] = messages;
        totalMessages += messages.length;
      } catch (error) {
        logger.warn(`Failed to export messages for conversation ${conv.id}:`, error);
        exportData.messages[conv.id] = [];
      }
    });
    
    exportData.metadata.totalMessages = totalMessages;
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `synthesis-ai-conversations-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    logger.info(`Exported ${conversations.length} conversations with ${totalMessages} total messages to ${exportFileDefaultName}`);
  } catch (error) {
    logger.error('Failed to export conversations:', error);
    throw error;
  }
};

/**
 * Imports conversations from a JSON file with configurable conflict resolution
 * @param file - The file containing conversation data to import
 * @param options - Configuration options for the import process
 * @param options.merge - Whether to merge with existing conversations or replace them
 * @param options.conflictResolution - How to handle ID conflicts: 'skip', 'replace', or 'rename'
 * @param options.showDialog - Whether to show confirmation dialog (unused in current implementation)
 * @returns Promise resolving to import statistics
 * @throws Error if import fails or file format is invalid
 */
export const importConversations = async (
  file: File, 
  options: { 
    merge: boolean;
    conflictResolution?: 'skip' | 'replace' | 'rename';
    showDialog?: boolean;
  } = { merge: true, conflictResolution: 'skip' }
): Promise<{ success: boolean, imported: number, skipped: number, replaced: number, renamed: number }> => {
  try {
    if (!file) {
      throw new Error('No file provided for import');
    }

    logger.info(`Starting import of conversations from file: ${file.name}`);
    
    const fileContent = await file.text();
    const importData = JSON.parse(fileContent);
    
    // Validate import data structure
    if (!importData.conversations || !importData.messages) {
      throw new Error('Invalid file format: missing conversations or messages');
    }
    
    if (!Array.isArray(importData.conversations)) {
      throw new Error('Invalid file format: conversations must be an array');
    }

    const existingConversations = options.merge ? getConversations() : [];
    const existingIds = new Set(existingConversations.map(c => c.id));
    const existingTitles = new Set(existingConversations.map(c => c.title));
    
    let imported = 0;
    let skipped = 0;
    let replaced = 0;
    let renamed = 0;
    
    // Process each conversation
    for (const conv of importData.conversations) {
      if (!conv.id || !conv.title) {
        logger.warn('Skipping conversation with missing id or title:', conv);
        skipped++;
        continue;
      }

      const hasConflict = existingIds.has(conv.id);
      
      if (hasConflict) {
        const conflictResolution = options.conflictResolution || 'skip';
        
        if (conflictResolution === 'skip') {
          skipped++;
          continue;
        } else if (conflictResolution === 'replace') {
          // Remove existing conversation
          const existingIndex = existingConversations.findIndex(c => c.id === conv.id);
          if (existingIndex >= 0) {
            existingConversations.splice(existingIndex, 1);
          }
          replaced++;
        } else if (conflictResolution === 'rename') {
          // Generate a unique ID and title
          conv.id = crypto.randomUUID();
          let newTitle = conv.title;
          let counter = 1;
          while (existingTitles.has(newTitle)) {
            newTitle = `${conv.title} (${counter})`;
            counter++;
          }
          conv.title = newTitle;
          existingTitles.add(newTitle);
          renamed++;
        }
      }
      
      // Import conversation with proper type mapping
      const conversation: Conversation = {
        id: conv.id,
        title: conv.title || 'New Chat',
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        folderId: conv.folderId,
        tags: conv.tags,
        isFavorite: conv.isFavorite,
        isPinned: conv.isPinned,
        description: conv.description,
        color: conv.color
      };
      
      logger.debug(`Importing conversation: "${conversation.title}" (${conversation.id})`);
      
      existingConversations.push(conversation);
      existingIds.add(conversation.id);
      
      // Import messages if they exist
      if (importData.messages[conv.id]) {
        try {
          const messages = importData.messages[conv.id].map((msg: {
            id: string;
            role: string;
            content: string;
            timestamp: string;
            model?: AIModel;
            regenerationCount?: number;
          }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          localStorage.setItem(`${MESSAGES_KEY_PREFIX}${conversation.id}`, JSON.stringify(messages));
        } catch (error) {
          logger.warn(`Failed to import messages for conversation ${conversation.id}:`, error);
        }
      }
      
      if (!hasConflict) {
        imported++;
      }
    }
    
    // Sort conversations by updatedAt with pinned conversations first
    existingConversations.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(existingConversations));
    
    // Dispatch update event
    dispatchConversationEvent(CONVERSATION_EVENTS.UPDATED);
    
    const result = { success: true, imported, skipped, replaced, renamed };
    logger.info(`Import completed: ${imported} imported, ${skipped} skipped, ${replaced} replaced, ${renamed} renamed`);
    return result;
  } catch (error) {
    logger.error('Failed to import conversations:', error);
    throw error;
  }
};

/**
 * Searches conversations by title, description, tags, or ID
 * @param query - The search query string
 * @returns Array of conversations matching the search query
 */
export const searchConversations = (query: string): Conversation[] => {
  try {
    if (!query || typeof query !== 'string') {
      logger.warn('Invalid search query provided');
      return [];
    }

    const conversations = getConversations();
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) {
      return conversations;
    }

    const results = conversations.filter(conv => 
      conv.title.toLowerCase().includes(lowerQuery) ||
      conv.id.includes(lowerQuery) ||
      conv.description?.toLowerCase().includes(lowerQuery) ||
      conv.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    logger.debug(`Search for "${query}" returned ${results.length} results`);
    return results;
  } catch (error) {
    logger.error('Failed to search conversations:', error);
    return [];
  }
};

/**
 * Toggles the favorite status of a conversation
 * @param conversationId - The unique identifier of the conversation
 * @throws Error if the conversation is not found or toggle fails
 */
export const toggleConversationFavorite = (conversationId: string): void => {
  try {
    if (!conversationId) {
      throw new Error('conversationId is required');
    }

    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const wasFavorite = conversation.isFavorite;
    conversation.isFavorite = !conversation.isFavorite;
    conversation.updatedAt = new Date();
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    dispatchConversationEvent(CONVERSATION_EVENTS.UPDATED, conversationId, conversation);
    logger.info(`${wasFavorite ? 'Removed' : 'Added'} favorite status for conversation: "${conversation.title}" (${conversationId})`);
  } catch (error) {
    logger.error('Failed to toggle conversation favorite:', error);
    throw error;
  }
};

/**
 * Toggles the pinned status of a conversation
 * Pinned conversations appear at the top of the conversation list
 * @param conversationId - The unique identifier of the conversation
 * @throws Error if the conversation is not found or toggle fails
 */
export const toggleConversationPinned = (conversationId: string): void => {
  try {
    if (!conversationId) {
      throw new Error('conversationId is required');
    }

    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const wasPinned = conversation.isPinned;
    conversation.isPinned = !conversation.isPinned;
    conversation.updatedAt = new Date();
    
    // Re-sort conversations to put pinned ones at the top
    conversations.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    dispatchConversationEvent(CONVERSATION_EVENTS.UPDATED, conversationId, conversation);
    logger.info(`${wasPinned ? 'Unpinned' : 'Pinned'} conversation: "${conversation.title}" (${conversationId})`);
  } catch (error) {
    logger.error('Failed to toggle conversation pinned status:', error);
    throw error;
  }
};

/**
 * Adds a tag to a conversation for categorization
 * @param conversationId - The unique identifier of the conversation
 * @param tag - The tag to add to the conversation
 * @throws Error if the conversation is not found or tag addition fails
 */
export const addConversationTag = (conversationId: string, tag: string): void => {
  try {
    if (!conversationId || !tag?.trim()) {
      throw new Error('conversationId and tag are required');
    }

    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    if (!conversation.tags) conversation.tags = [];
    
    const trimmedTag = tag.trim();
    if (!conversation.tags.includes(trimmedTag)) {
      conversation.tags.push(trimmedTag);
      conversation.updatedAt = new Date();
      
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      dispatchConversationEvent(CONVERSATION_EVENTS.UPDATED, conversationId, conversation);
      logger.info(`Added tag "${trimmedTag}" to conversation: "${conversation.title}" (${conversationId})`);
    } else {
      logger.debug(`Tag "${trimmedTag}" already exists on conversation ${conversationId}`);
    }
  } catch (error) {
    logger.error('Failed to add conversation tag:', error);
    throw error;
  }
};

/**
 * Removes a tag from a conversation
 * @param conversationId - The unique identifier of the conversation
 * @param tag - The tag to remove from the conversation
 * @throws Error if the conversation is not found or tag removal fails
 */
export const removeConversationTag = (conversationId: string, tag: string): void => {
  try {
    if (!conversationId || !tag?.trim()) {
      throw new Error('conversationId and tag are required');
    }

    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    if (conversation.tags) {
      const trimmedTag = tag.trim();
      const originalLength = conversation.tags.length;
      conversation.tags = conversation.tags.filter(t => t !== trimmedTag);
      
      if (conversation.tags.length < originalLength) {
        conversation.updatedAt = new Date();
        
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
        dispatchConversationEvent(CONVERSATION_EVENTS.UPDATED, conversationId, conversation);
        logger.info(`Removed tag "${trimmedTag}" from conversation: "${conversation.title}" (${conversationId})`);
      } else {
        logger.debug(`Tag "${trimmedTag}" was not found on conversation ${conversationId}`);
      }
    }
  } catch (error) {
    logger.error('Failed to remove conversation tag:', error);
    throw error;
  }
};

/**
 * Moves a conversation to a different folder or to the root level
 * @param conversationId - The unique identifier of the conversation
 * @param folderId - The target folder ID, or undefined to move to root level
 * @throws Error if the conversation is not found or move fails
 */
export const moveConversationToFolder = (conversationId: string, folderId?: string): void => {
  try {
    if (!conversationId) {
      throw new Error('conversationId is required');
    }

    const conversations = getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const previousFolderId = conversation.folderId;
    conversation.folderId = folderId;
    conversation.updatedAt = new Date();
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    dispatchConversationEvent(CONVERSATION_EVENTS.UPDATED, conversationId, conversation);
    
    const targetLocation = folderId || 'root';
    const previousLocation = previousFolderId || 'root';
    logger.info(`Moved conversation "${conversation.title}" from ${previousLocation} to ${targetLocation} (${conversationId})`);
  } catch (error) {
    logger.error('Failed to move conversation to folder:', error);
    throw error;
  }
};

/**
 * Retrieves conversations belonging to a specific folder
 * @param folderId - The folder ID to filter by, or undefined for root-level conversations
 * @returns Array of conversations in the specified folder
 */
export const getConversationsByFolder = (folderId?: string): Conversation[] => {
  try {
    const conversations = getConversations();
    const filtered = conversations.filter(conv => conv.folderId === folderId);
    
    logger.debug(`Found ${filtered.length} conversations in folder: ${folderId || 'root'}`);
    return filtered;
  } catch (error) {
    logger.error('Failed to get conversations by folder:', error);
    return [];
  }
};

/**
 * Retrieves all conversations marked as favorites
 * @returns Array of favorite conversations
 */
export const getFavoriteConversations = (): Conversation[] => {
  try {
    const conversations = getConversations();
    const favorites = conversations.filter(conv => conv.isFavorite);
    
    logger.debug(`Found ${favorites.length} favorite conversations`);
    return favorites;
  } catch (error) {
    logger.error('Failed to get favorite conversations:', error);
    return [];
  }
};

/**
 * Retrieves all unique tags used across all conversations
 * @returns Array of unique tags sorted alphabetically
 */
export const getAllTags = (): string[] => {
  try {
    const conversations = getConversations();
    const tags = new Set<string>();
    
    conversations.forEach(conv => {
      conv.tags?.forEach(tag => {
        if (tag?.trim()) {
          tags.add(tag.trim());
        }
      });
    });
    
    const sortedTags = Array.from(tags).sort();
    logger.debug(`Found ${sortedTags.length} unique tags`);
    return sortedTags;
  } catch (error) {
    logger.error('Failed to get all tags:', error);
    return [];
  }
};

/**
 * Retrieves conversations that have a specific tag
 * @param tag - The tag to filter conversations by
 * @returns Array of conversations with the specified tag
 */
export const getConversationsByTag = (tag: string): Conversation[] => {
  try {
    if (!tag?.trim()) {
      logger.warn('getConversationsByTag called with invalid tag');
      return [];
    }

    const conversations = getConversations();
    const trimmedTag = tag.trim();
    const filtered = conversations.filter(conv => conv.tags?.includes(trimmedTag));
    
    logger.debug(`Found ${filtered.length} conversations with tag: "${trimmedTag}"`);
    return filtered;
  } catch (error) {
    logger.error('Failed to get conversations by tag:', error);
    return [];
  }
};

/**
 * Calculates and returns statistics about all conversations
 * @returns Object containing conversation statistics including totals and date ranges
 */
export const getConversationStats = (): {
  totalConversations: number;
  totalMessages: number;
  oldestConversation: Conversation | null;
  newestConversation: Conversation | null;
  favoriteCount: number;
  pinnedCount: number;
  taggedCount: number;
  uniqueTags: number;
} => {
  try {
    const conversations = getConversations();
    let totalMessages = 0;
    let favoriteCount = 0;
    let pinnedCount = 0;
    let taggedCount = 0;
    
    conversations.forEach(conv => {
      try {
        const messages = getConversationMessages(conv.id);
        totalMessages += messages.length;
      } catch (error) {
        logger.warn(`Failed to get messages for conversation ${conv.id} during stats calculation:`, error);
      }
      
      if (conv.isFavorite) favoriteCount++;
      if (conv.isPinned) pinnedCount++;
      if (conv.tags && conv.tags.length > 0) taggedCount++;
    });
    
    const uniqueTags = getAllTags().length;
    
    const stats = {
      totalConversations: conversations.length,
      totalMessages,
      oldestConversation: conversations.length > 0 ? 
        conversations.reduce((oldest, conv) => 
          conv.createdAt < oldest.createdAt ? conv : oldest
        ) : null,
      newestConversation: conversations.length > 0 ? 
        conversations.reduce((newest, conv) => 
          conv.createdAt > newest.createdAt ? conv : newest
        ) : null,
      favoriteCount,
      pinnedCount,
      taggedCount,
      uniqueTags
    };
    
    logger.debug('Generated conversation statistics:', stats);
    return stats;
  } catch (error) {
    logger.error('Failed to generate conversation statistics:', error);
    return {
      totalConversations: 0,
      totalMessages: 0,
      oldestConversation: null,
      newestConversation: null,
      favoriteCount: 0,
      pinnedCount: 0,
      taggedCount: 0,
      uniqueTags: 0
    };
  }
};