# LangGraph AI Battle Arena

A backend application built with Node.js, TypeScript, LangChain, and LangGraph that facilitates an automated "battle" between different Large Language Models (LLMs). 

The system leverages multiple LLMs (such as Google Gemini, Mistral, and Cohere) to generate competing solutions for a given prompt. It then uses a graph-based state machine to analyze, judge, and score their responses to ultimately declare a winner.

## 🚀 Features
- **Multi-Model Support:** Seamlessly integrates with multiple top-tier AI models including Google Gemini, Mistral AI, and Cohere via LangChain.
- **Workflow State Management:** Utilizes **LangGraph** to manage complex conversational states, track individual model outputs (`solution_1`, `solution_2`), and store the final judgment.
- **Automated Judgement Arena:** Pits two AI solutions against each other, evaluates them, and determines the winner based on calculated scores.

## 🛠️ Tech Stack
- **Environment:** Node.js
- **Language:** TypeScript
- **AI/LLM Framework:** [LangChain](https://js.langchain.com/) (`@langchain/google`, `@langchain/mistralai`, `@langchain/cohere`)
- **State Management:** [LangGraph](https://langchain-ai.github.io/langgraphjs/) (`@langchain/langgraph`)

## ⚙️ Prerequisites & Setup

1. **Clone the repository** and navigate to the project directory:
   ```bash
   cd LANGGAPH-BATTLE-AI-ARENA
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Provide API Keys:**
   Create a `.env` file in the root directory of the project and add your respective API keys for the AI models:
   ```env
   GOOGLE_API_KEY="your_google_gemini_api_key_here"
   MISTRAL_API_KEY="your_mistral_api_key_here"
   COHERE_API_KEY="your_cohere_api_key_here"
   ```

## 📂 Project Structure Overview
- `src/config/config.ts`: Securely loads and manages environment variables.
- `src/services/models.service.ts`: Initializes and exports the LangChain chat model instances (Gemini, Mistral, Cohere).
- `src/services/grap.ai.service.ts`: Defines the LangGraph state schema for the battle, including schemas to track the messages, both solutions, and the final judgment (winner and scores).
