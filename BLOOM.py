from transformers import AutoTokenizer, AutoModelForCausalLM, set_seed
import torch
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("bigscience/bloom-1b7")
model = AutoModelForCausalLM.from_pretrained("bigscience/bloom-1b7")

# Set the seed for reproducibility
set_seed(11111)

# Define the text prompt
text_prompt = "Who is George Washington?"

# Tokenize the input text
input_tokens = tokenizer(text_prompt, return_tensors="pt")

# Generate text based on the prompt
result_sample = model.generate(**input_tokens, max_length=200, top_k=0, temperature=0.5)

# Decode and print the generated text
print("Generated Text:\n", tokenizer.decode(result_sample[0], skip_special_tokens=True))

# Compute similarity between prompt and generated text embeddings
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
prompt_length = len(text_prompt)
length_multiplier = 3
max_length = min(200, prompt_length * length_multiplier)
input_tokens = tokenizer(text_prompt, return_tensors="pt")
with torch.no_grad():
    result_sample = model.generate(
        **input_tokens,
        max_length=max_length,
        do_sample=True,
        top_p=0.85,
        top_k=50,
        temperature=0.7,
        num_return_sequences=1
    )
generated_text = tokenizer.decode(result_sample[0], skip_special_tokens=True)
prompt_embedding = (
    model.get_input_embeddings()(
        torch.tensor(tokenizer.encode(text_prompt, add_special_tokens=False)).unsqueeze(
            0
        )
    )
    .detach()
    .cpu()
    .numpy()
)
generated_embedding = (
    model.get_input_embeddings()(
        torch.tensor(
            tokenizer.encode(generated_text, add_special_tokens=False)
        ).unsqueeze(0)
    )
    .detach()
    .cpu()
    .numpy()
)
max_length = max(prompt_embedding.shape[1], generated_embedding.shape[1])
prompt_pad_length = max_length - prompt_embedding.shape[1]
generated_pad_length = max_length - generated_embedding.shape[1]
prompt_embedding = np.pad(
    prompt_embedding,
    ((0, 0), (0, max_length - prompt_embedding.shape[1]), (0, 0)),
    mode="constant",
    constant_values=0,
)
generated_embedding = np.pad(
    generated_embedding,
    ((0, 0), (0, max_length - generated_embedding.shape[1]), (0, 0)),
    mode="constant",
    constant_values=0,
)
prompt_embedding = prompt_embedding.squeeze(axis=0)
generated_embedding = generated_embedding.squeeze(axis=0)
similarity_scores = []
for i in range(min(prompt_embedding.shape[1], generated_embedding.shape[1])):
    similarity_score = cosine_similarity(
        prompt_embedding[:, i].reshape(1, -1), generated_embedding[:, i].reshape(1, -1)
    )
    similarity_scores.append(similarity_score)
accuracy_percentage = (1 - np.abs(1 - similarity_score)) * 100
print("Generated Text:\n", generated_text)
print("Accuracy Percentage:", accuracy_percentage)
