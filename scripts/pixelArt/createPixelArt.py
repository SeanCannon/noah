import os
import base64
import time
import requests

API_URL = "https://api.retrodiffusion.ai/v1/inferences"
API_KEY = "rdpk-a5725a0c931bac4fb986636f269e8491"  # 🔁 Replace with your actual API key
OUTPUT_DIR = "output"
WAIT_SECONDS = 5

# Full animal list
animals = [
  "Alligator", "Ant", "Ape", "Armadillo", "Baboon", "Bat", "Bear", "Bee", "Beetle", "Bird",
  "Bison", "Camel", "Capybara", "Cat", "Caterpillar", "Cattle", "Chameleon", "Cheetah", "Chicken", "Chimpanzee",
  "Cockroach", "Coyote", "Crocodile", "Deer", "Dog", "Donkey", "Dove", "Duck", "Eagle", "Elephant",
  "Emu", "Falcon", "Ferret", "Flamingo", "Fly", "Fox", "Frog", "Gazelle", "Gecko", "Giraffe",
  "Goat", "Goose", "Gorilla", "Grasshopper", "Grouse", "Guinea pig", "Hamster", "Hare", "Hawk", "Hedgehog",
  "Hippopotamus", "Hornet", "Horse", "Hummingbird", "Hyena", "Iguana", "Jackal", "Jaguar", "Kangaroo", "Koala",
  "Lamb", "Leopard", "Lion", "Lizard", "Llama", "Mole", "Monkey", "Moose", "Mouse", "Mule",
  "Newt", "Ocelot", "Opossum", "Orangutan", "Ostrich", "Otter", "Owl", "Ox", "Panda", "Parrot",
  "Peacock", "Pelican", "Penguin", "Pig", "Pigeon", "Porcupine", "Possum", "Rabbit", "Raccoon", "Rat",
  "Raven", "Reindeer", "Rhinoceros", "Scorpion", "Sheep", "Skunk", "Sloth", "Snail", "Snake", "Spider",
  "Squirrel", "Swan", "Tiger", "Toad", "Turkey", "Turtle", "Vulture", "Wasp", "Weasel", "Wolf",
  "Wombat", "Woodpecker", "Yak", "Zebra"
]

animals_fantasy = [
  "Unicorn", "Dragon", "Gargoyle"
]
# Generate prompts
prompts = [f"a male {a}" for a in animals] + [f"a female {a}" for a in animals]
total = len(prompts)

# Ensure output folder exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_image(base64_data, filename):
  try:
    image_data = base64.b64decode(base64_data)
    with open(filename, "wb") as f:
      f.write(image_data)
  except Exception as e:
    print(f"❌ Failed to save image {filename}: {e}")

def generate_image(prompt):
  headers = {
    "X-RD-Token": API_KEY,
    "Content-Type": "application/json"
  }
  
  payload = {
    "prompt": prompt,
    "width": 256,
    "height": 256,
    "style": "rd_fast__mc_item",
    "remove_bg": True,
    "return_non_bg_removed": True,
    "num_images": 1
  }
  
  try:
    response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
    response.raise_for_status()
    return response.json()
  except Exception as e:
    print(f"❌ API error for '{prompt}': {e}")
    return None

def main():
  print(f"\n🚀 Starting batch of {total} prompts...\n")
  start_time = time.time()
  
  for idx, prompt in enumerate(prompts, start=1):
    filename = prompt.replace(" ", "_") + ".png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    if os.path.exists(filepath):
      print(f"⚠️ Skipping existing: {filename}")
      continue
    
    result = generate_image(prompt)
    if not result or "base64_images" not in result:
      print(f"❌ No image returned for: {prompt}")
    else:
      base64_image = result["base64_images"][0]
      save_image(base64_image, filepath)
      print(f"✅ Saved: {filename}")
    
    elapsed = time.time() - start_time
    remaining = (elapsed / idx) * (total - idx)
    print(f"Progress: {idx}/{total} | Elapsed: {elapsed:.1f}s | ETA: {remaining:.1f}s\n")
    
    time.sleep(WAIT_SECONDS)

if __name__ == "__main__":
  main()
