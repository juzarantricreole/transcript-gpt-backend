import { Injectable } from '@nestjs/common';
import { isVectorStoreExists } from '../common/helper/vector.store.check.js';
import { HNSWLib } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import path from 'path';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAI } from 'langchain/llms/openai';
import {
  ConversationalRetrievalQAChain,
  loadSummarizationChain,
} from 'langchain/chains';
import {
  list_challenges,
  listing_issues,
  list_keywords,
  solutions_based_challenges,
  list_risks,
  solutions_based_challenges_and_risks,
} from '../prompts/prompts.js';
import { getModel, getVectorStore } from '../common/helper/langchain.helper.js';
import { fileURLToPath } from 'url';
import { PromptTemplate } from 'langchain/prompts';
import { ConfigService } from '@nestjs/config';

/// Global variables
let count: number = 0;
let OPEN_AI_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Injectable()
export class LangChainService {
  constructor(private readonly config: ConfigService) {
    OPEN_AI_KEY = this.config.get<string>('OPEN_AI_KEY');
  }
  /// Vector store
  async createVectorStore(text: string) {
    try {
      /// if vector store exists then add data to it else create new store
      if (!isVectorStoreExists(__dirname)) {
        let vectorstore;
        /* Split the text into chunks */
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
        });
        const docs = await textSplitter.createDocuments([text]);
        /* Create the vectorstore */
        vectorstore = await HNSWLib.fromDocuments(
          docs,
          new OpenAIEmbeddings({
            openAIApiKey: OPEN_AI_KEY,
          }),
        );
        console.log('VectorStore Created....');

        /// Save the vector store to a directory
        await vectorstore.save(path.resolve(__dirname, '../local-store'));
      } else {
        // Load the vector store from the same directory
        const loadedVectorStore = await HNSWLib.load(
          path.resolve(__dirname, '../local-store'),
          new OpenAIEmbeddings({ openAIApiKey: OPEN_AI_KEY }),
        );
        /* Split the text into chunks */
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
        });
        const docs = await textSplitter.createDocuments([text]);
        await loadedVectorStore.addDocuments(docs);
        console.log('Data added to the VectorStore....');
        /// Save the vector store to the same directory
        await loadedVectorStore.save(path.resolve(__dirname, '../local-store'));
      }
    } catch (e) {
      console.log(
        'Error in createVectorStore Function of langchain.service.ts ',
        e,
      );
    }
  }

  async getIssues() {
    try {
      /* Create the chain for retrival*/
      let chain = ConversationalRetrievalQAChain.fromLLM(
        await getModel(++count, OPEN_AI_KEY),
        (await getVectorStore(OPEN_AI_KEY)).asRetriever(),
      );

      const res = await chain.call({
        question: listing_issues,
        chat_history: [],
      });
      return { issues: res.text };
    } catch (e) {
      console.log('Error in getIssues Function of langchain.service.ts ', e);
    }
  }

  async getKeywords() {
    try {
      /* Create the chain for retrival*/
      let chain = ConversationalRetrievalQAChain.fromLLM(
        await getModel(++count, OPEN_AI_KEY),
        (await getVectorStore(OPEN_AI_KEY)).asRetriever(),
      );

      const res = await chain.call({
        question: list_keywords,
        chat_history: [],
      });
      return { keywords: res.text };
    } catch (e) {
      console.log('Error in getKeywords Function of langchain.service.ts ', e);
    }
  }

  async getChallenges() {
    try {
      /* Create the chain for retrival*/

      let chain = ConversationalRetrievalQAChain.fromLLM(
        await getModel(++count, OPEN_AI_KEY),
        (await getVectorStore(OPEN_AI_KEY)).asRetriever(),
      );

      const res = await chain.call({
        question: list_challenges,
        chat_history: [],
      });
      return { challenges: res.text };
    } catch (e) {
      console.log(
        'Error in getChallenges Function of langchain.service.ts ',
        e,
      );
    }
  }

  async getRisks() {
    try {
      /* Create the chain for retrival*/
      let chain = ConversationalRetrievalQAChain.fromLLM(
        await getModel(++count, OPEN_AI_KEY),
        (await getVectorStore(OPEN_AI_KEY)).asRetriever(),
      );

      const res = await chain.call({
        question: list_risks,
        chat_history: [],
      });
      return { risks: res.text };
    } catch (e) {
      console.log('Error in getRisks Function of langchain.service.ts ', e);
    }
  }

  async getSolutionsOnChallenges() {
    try {
      /* Create the chain for retrival*/
      let chain = ConversationalRetrievalQAChain.fromLLM(
        await getModel(++count, OPEN_AI_KEY),
        (await getVectorStore(OPEN_AI_KEY)).asRetriever(),
      );

      const res = await chain.call({
        question: solutions_based_challenges,
        chat_history: [],
      });
      return { solutions: res.text };
    } catch (e) {
      console.log(
        'Error in getSolutionsOnChallenges Function of langchain.service.ts ',
        e,
      );
    }
  }
  async getSolutionsOnChallengesAndRisks() {
    try {
      /* Create the chain for retrival*/
      let chain = ConversationalRetrievalQAChain.fromLLM(
        await getModel(++count, OPEN_AI_KEY),
        (await getVectorStore(OPEN_AI_KEY)).asRetriever(),
      );

      const res = await chain.call({
        question: solutions_based_challenges_and_risks,
        chat_history: [],
      });
      return { solutions: res.text };
    } catch (e) {
      console.log(
        'Error in getSolutionsOnChallengesAndRisks Function of langchain.service.ts ',
        e,
      );
    }
  }
}
