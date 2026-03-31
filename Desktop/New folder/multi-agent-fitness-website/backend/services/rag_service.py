import os
from typing import List, Dict
import json

# Try to import optional dependencies
try:
    import chromadb
    from chromadb.config import Settings
    CHROMADB_AVAILABLE = True
except ImportError:
    CHROMADB_AVAILABLE = False
    print("Warning: ChromaDB not available. RAG features will be limited.")

try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    print("Warning: sentence-transformers not available. RAG features will be limited.")

class RAGService:
    def __init__(self):
        if not CHROMADB_AVAILABLE:
            self.client = None
            self.fitness_collection = None
            self.nutrition_collection = None
            self.user_notes_collection = None
            self.embedder = None
            print("RAG Service initialized in degraded mode (no vector database)")
            return
        
        try:
            self.client = chromadb.Client(Settings(
                chroma_db_impl="duckdb+parquet",
                persist_directory="./chroma_db"
            ))
            
            if SENTENCE_TRANSFORMERS_AVAILABLE:
                self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
            else:
                self.embedder = None
            
            # Initialize collections
            self.fitness_collection = self.client.get_or_create_collection(
                name="fitness_knowledge",
                metadata={"description": "Fitness and workout knowledge base"}
            )
            self.nutrition_collection = self.client.get_or_create_collection(
                name="nutrition_knowledge",
                metadata={"description": "Nutrition and diet knowledge base"}
            )
            self.user_notes_collection = self.client.get_or_create_collection(
                name="user_notes",
                metadata={"description": "User feedback and notes"}
            )
            
            # Initialize knowledge base if empty
            self._initialize_knowledge_base()
        except Exception as e:
            print(f"Warning: Could not initialize ChromaDB: {e}. RAG features will be limited.")
            self.client = None
            self.fitness_collection = None
            self.nutrition_collection = None
            self.user_notes_collection = None
    
    def _initialize_knowledge_base(self):
        """Initialize knowledge base with default fitness and nutrition data"""
        if not self.fitness_collection or not self.nutrition_collection:
            return
            
        try:
            if self.fitness_collection.count() == 0:
                fitness_data = [
                    "For fat loss, focus on high-intensity interval training (HIIT) 3-4 times per week, combined with strength training.",
                    "Muscle gain requires progressive overload, consuming 1.6-2.2g protein per kg body weight, and adequate rest.",
                    "Endurance training should include 2-3 long cardio sessions per week, gradually increasing duration.",
                    "Strength training for beginners: Start with 3 sets of 8-12 reps, 2-3 times per week.",
                    "Rest days are crucial: Allow 48 hours between training the same muscle groups.",
                    "Proper form is more important than lifting heavy weights to prevent injury.",
                ]
                
                for i, text in enumerate(fitness_data):
                    self.fitness_collection.add(
                        documents=[text],
                        ids=[f"fitness_{i}"],
                        metadatas=[{"type": "fitness", "source": "default"}]
                    )
            
            if self.nutrition_collection.count() == 0:
                nutrition_data = [
                    "For fat loss: Create a 500-750 calorie deficit daily, prioritize protein (25-30% of calories), include fiber-rich foods.",
                    "Muscle gain: Eat in a 300-500 calorie surplus, aim for 1.6-2.2g protein per kg, include complex carbs post-workout.",
                    "Macronutrient ratios for general fitness: 40% carbs, 30% protein, 30% fats.",
                    "Hydration: Drink 30-35ml per kg body weight, increase during exercise.",
                    "Meal timing: Eat protein within 2 hours post-workout for optimal muscle recovery.",
                    "Pre-workout nutrition: Consume easily digestible carbs 30-60 minutes before exercise.",
                ]
                
                for i, text in enumerate(nutrition_data):
                    self.nutrition_collection.add(
                        documents=[text],
                        ids=[f"nutrition_{i}"],
                        metadatas=[{"type": "nutrition", "source": "default"}]
                    )
        except Exception as e:
            print(f"Warning: Could not initialize knowledge base: {e}")
    
    def add_user_note(self, user_id: str, note_content: str):
        """Add user note to vector database"""
        if not self.user_notes_collection:
            return  # Silently fail if RAG is not available
        
        try:
            note_id = f"note_{user_id}_{len(self.user_notes_collection.get().get('ids', []))}"
            self.user_notes_collection.add(
                documents=[note_content],
                ids=[note_id],
                metadatas=[{"user_id": user_id, "type": "user_note"}]
            )
        except Exception as e:
            print(f"Warning: Could not add user note to RAG: {e}")
    
    def retrieve_relevant_context(
        self, 
        query: str, 
        user_id: str = None,
        collection_type: str = "both"
    ) -> str:
        """Retrieve relevant context from knowledge base"""
        if not self.client or not self.fitness_collection or not self.nutrition_collection:
            # Return default context if RAG is not available
            return "Fitness and nutrition guidance based on user profile."
        
        contexts = []
        
        try:
            # Retrieve from fitness knowledge
            if collection_type in ["both", "fitness"]:
                fitness_results = self.fitness_collection.query(
                    query_texts=[query],
                    n_results=3
                )
                if fitness_results['documents']:
                    contexts.extend(fitness_results['documents'][0])
            
            # Retrieve from nutrition knowledge
            if collection_type in ["both", "nutrition"]:
                nutrition_results = self.nutrition_collection.query(
                    query_texts=[query],
                    n_results=3
                )
                if nutrition_results['documents']:
                    contexts.extend(nutrition_results['documents'][0])
            
            # Retrieve from user notes if user_id provided
            if user_id and self.user_notes_collection:
                try:
                    # Get all notes for this user and filter
                    all_user_notes = self.user_notes_collection.get(
                        where={"user_id": user_id}
                    )
                    if all_user_notes and all_user_notes.get('documents'):
                        # Query from user notes only
                        user_notes_results = self.user_notes_collection.query(
                            query_texts=[query],
                            n_results=min(2, len(all_user_notes['documents'])),
                            where={"user_id": user_id}
                        )
                        if user_notes_results.get('documents') and user_notes_results['documents']:
                            contexts.extend(user_notes_results['documents'][0])
                except Exception as e:
                    # If filtering fails, just skip user notes
                    pass
        except Exception as e:
            print(f"Warning: Could not retrieve context from RAG: {e}")
        
        return "\n".join(contexts) if contexts else ""

rag_service = RAGService()
