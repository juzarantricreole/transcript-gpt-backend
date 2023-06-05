import { OpenAIEmbeddings } from 'langchain/embeddings';
import { OpenAI } from 'langchain/llms/openai';
import { HNSWLib } from 'langchain/vectorstores';
import path from 'path';
import { fileURLToPath } from 'url';

/// Global variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Initialize the LLM model */
export const getModel = async (count: number, KEY: string): Promise<OpenAI> => {
  const model = new OpenAI({
    openAIApiKey: KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.5,
    // topP: 1.0,
    maxTokens: 1000,
    maxConcurrency: 10,
    maxRetries: 10,
    cache: true,
    streaming: true,
    callbacks: [
      {
        handleLLMStart: async () => {
          console.log('\nAPI CALL :', count);
        },
        handleLLMNewToken(token: string) {
          process.stdout.write(token);
        },
        handleLLMEnd: async () => {
          process.stdout.write('\n\n');
        },
      },
    ],
  });

  return model;
};

/* Getting the vector store */
export const getVectorStore = async (KEY: string): Promise<HNSWLib> => {
  // Load the vector store from the same directory
  const loadedVectorStore = await HNSWLib.load(
    path.resolve(__dirname, '../../', 'local-store'),
    new OpenAIEmbeddings({ openAIApiKey: KEY }),
  );
  return loadedVectorStore;
};
