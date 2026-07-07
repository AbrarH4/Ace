from tkinter import filedialog, messagebox
import json


def export_flashcards(flashcards):
    file_path = filedialog.asksaveasfilename(
        filetypes=[
            ("Text file / Anki compatible", "*.txt"),
            ("JSON files", "*.json"),
        ],
        defaultextension=".txt",
        initialfile="flashcards",
    )
    if not file_path:
        return messagebox.showerror("Export Failed", "No file path selected.")

    if file_path.endswith(".json"):
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(flashcards, f, indent=2, ensure_ascii=False)
    else:
        with open(file_path, "w", encoding="utf-8") as f:
            for flashcard in flashcards:
                f.write(f"{flashcard['front']}\t{flashcard['back']}\n")

    messagebox.showinfo("Export Successful", f"Exported to:\n{file_path}")
