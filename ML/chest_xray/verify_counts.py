import os

base = "dataset"
splits = ["train", "test", "val"]
classes = ["NORMAL", "PNEUMONIA"]

for split in splits:
    print(f"\n--- {split.upper()} ---")
    
    for cls in classes:
        path = os.path.join(base, split, cls)
        
        # Count only image files
        count = len([
            f for f in os.listdir(path)
            if f.lower().endswith((".png", ".jpg", ".jpeg"))
        ])
        
        print(f"{cls}: {count}")
