# 🃏 RandomTarot · Offline Pure Random Tarot Reading

> No internet, no AI, no mysterious server-side tricks — only **you, the present moment, and information irrelevant to your question** determine which card is drawn.

A lightweight tarot reading tool built with **uni-app**.  
From December 2024 to April 2025, the author has used it for dozens of personal matters — big and small — and **honestly finds it quite accurate**.  
It doesn't trust the subjective "understanding" of large language models. Instead, it relies only on **time, numbers, irrelevant information, and the question itself** to anchor a single, pure random draw.

---

## ✨ Core Philosophy

Most tarot apps/websites either use pseudo-randomness or quietly call AI APIs in the background, polluting results with model bias.  
**OfflineTarot does this differently:**

- 🔒 **Fully Offline** – All code, card images, and interpretations are packaged locally. No backend requests.
- 🎲 **No LLM Interference** – No large language models, no cloud inference, no "pleasing" interpretations.
- 🌱 **Objective Random Seeds** – The drawn card is determined by:
  - Current precise time (milliseconds)
  - A number you enter
  - **Information completely irrelevant to your question** (e.g., a license plate outside, the word count of your last notification)
  - Your question text (optional)
- 📐 **I-Ching Style Randomization** – These seemingly unrelated factors are mixed and hashed, finally mapping to a tarot card.
- 💾 **Local History** (currently rough but functional)

Simply put: it's not "what the tarot is thinking", but "in this moment, through the irrelevant information you provide, which card does the universe turn over?"

---

## 🧭 Current Status

✅ Implemented:

- All 78 basic tarot cards (upright & reversed)
- Simple randomization algorithm based on "time + number + irrelevant info + question"
- Single card draw
- Very basic local history (stores draw results and time)
- Reset state (known minor bug: you must fill all fields again before drawing)

🚧 Known limitations & TODOs:

1. **Interpretation prompts are not professional** – lacks proper tarot terminology
2. **UI needs improvement** – functional but not beautiful
3. **Spread support incomplete** – currently only single card draw
4. **No in-depth card meaning library** – planned
5. **Future deck expansion** – possibly oracle cards, Lenormand
6. **Random algorithm not fully transparent/optimized** – currently simple hashing, not yet maximizing tarot-specific entropy
7. **History feature is rough** – no search, deletion, or statistics
8. **Minor bugs** – e.g., reset requires refilling all fields before drawing

---

## 📸 Preview (placeholder)

<img width="643" height="662" alt="image" src="https://github.com/user-attachments/assets/6c58b8e2-ce21-4214-a0de-766259cb7fd7" />
<img width="637" height="650" alt="image" src="https://github.com/user-attachments/assets/d7b10e8b-7736-4498-9913-07b966e0d99d" />
<img width="631" height="653" alt="image" src="https://github.com/user-attachments/assets/61709302-593d-4adc-9439-5f9eb8c01837" />
> Currently looks like "developer UI". PRs welcome.

---

## 🛠️ Tech Stack

| Category    | Tools/Solutions                                              |
| ----------- | ------------------------------------------------------------ |
| Frontend    | uni-app (Vue 3)                                              |
| Platforms   | H5 / WeChat Mini Program / App (mainly H5 tested)            |
| Storage     | localStorage / uni.setStorage                                |
| Random Seed | Hash of timestamp + user number + irrelevant info + question text |
| Card Data   | Local JSON (with brief upright/reversed meanings)            |

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/yourname/offline-tarot.git
cd offline-tarot

# 2. Install dependencies
npm install

# 3. Run in H5 mode
npm run dev:h5
```

Or import directly into **HBuilderX** and run in browser / mini program.

Since it's fully offline, you can build it and deploy to any static server, or even open it locally with `file://`

## 📖 How to Draw a Card

1. Open the page, you'll see input fields:
   - **Your question** (optional, only affects random seed)
   - **A number** (required, e.g., 3, 42, your current heart rate)
   - **Information completely irrelevant to your question** (required, e.g., "there's a cat outside" / "battery at 67%" / "the third letter on my keyboard is F")
2. Click **"Draw Card"**
3. The system captures the current millisecond timestamp, mixes it with the above info → hash → determines card and orientation
4. Display the card, brief meaning, and save to local history
5. To reset, click "Reset State" (note: currently requires refilling all fields to draw again)

------

## 🧪 About the Random Algorithm (Current Version)

Current algorithm is a simple combination:

- Collect: `timestamp + number + irrelevant info string + question string`
- Compute a simple hash (e.g., loop over char codes + bitwise operations)
- Modulo 78 for card number, modulo 2 for upright/reversed

**Why is it not perfect?**
Tarot ideally involves synchronicity. The ideal random should include more physical entropy (device sensors, mouse trajectories, etc.). The current solution **avoids pure `Math.random()` pseudo-randomness**, but hasn't yet maximized tarot-specific randomness.
Future plan: introduce `crypto.getRandomValues` + user interaction entropy pool.

> If you're passionate about randomness, feel free to discuss in Issues.

------

## 🗺️ Future Plans

- Refactor interpretation prompts with proper tarot meanings (upright/reversed/elements/astrology)
- New UI design with dark mode
- Classic spreads: Three-card (Past-Present-Future), Celtic Cross, Choice spread
- In-depth card meaning library + learning mode (symbolism, mythology)
- Support for additional decks (oracle cards as separate module)
- Open-source the random algorithm and visualize the entropy source, letting users verify "how this card was actually drawn"
- Improve history: delete, export, card frequency statistics
- Fix the "reset requires refilling all fields" bug

------

## 🤝 Open Source Plan & Contributing

This project is currently **personal use + experimental**.
The author is studying how to open source under "conditional licensing", with these principles:

- Non-commercial / personal learning: free to use the source code
- Modified versions published publicly must retain the original philosophy (to avoid being repackaged as "AI Tarot")
- Commercial use, customization, or integration into other products requires separate permission

welcome to:

- Open [Issues](https://github.com/lianshuying64-star/RandomTarot/issues) for bugs, suggestions, or random algorithm discussions
- Tell me what features you want, or correct card meaning errors
- If you have UI / tarot expertise / randomness experience and want to help improve, please discuss via Issues first

------

## 📜 Known Minor Issues

- ⚠️ After reset, you must **refill number + irrelevant info + question** before drawing (unintended validation)
- ⚠️ History has no pagination — gets long after many draws
- ⚠️ Some mobile style glitches (uni-app compatibility to be fixed)

------

## 📬 Contact Author

- GitHub: `https://github.com/lianshuying64-star/lianshuying64-star.github.io`
- Email: 3053888727@qq.com
- For tarot randomness discussions / tech meets mysticism → feel free to open an Issue

------

## 🌟 Final Words

> This tool doesn't promise to "predict the future". It only promises to give you **a random reflection uninfluenced by anyone (and any AI)**.
> If you're tired of "big data tarot" and "pleasing interpretations", give it a chance.

**Tarot is a mirror, not a prophet.
This mirror has no algorithm bias.**
