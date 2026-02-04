# 🎭 Ani-Charades

A fun, interactive charades game perfect for parties, team building, or just having a good time! Players act out words or phrases while others guess. Built with vanilla HTML, CSS, and JavaScript - no frameworks needed!

## 🌐 Live Demo
**[Play Now!](https://mechworrior.github.io/Ani-charades/)**

## 🎮 Features

- **Three Difficulty Levels**: Easy, Medium, and Hard words
- **Customizable Timer**: Set game duration from 30 to 300 seconds
- **Score Tracking**: Keep track of correct answers and skipped words
- **Admin Panel**: Add, edit, and manage your own charades words
- **Data Persistence**: Uses localStorage to save custom words
- **Import/Export**: Backup and share your word collections
- **Keyboard Shortcuts**: Space/Enter for next word, Right Arrow to skip
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Play Online:
Just visit **[https://mechworrior.github.io/Ani-charades/](https://mechworrior.github.io/Ani-charades/)**

### Run Locally:
1. Clone this repository
2. Open `index.html` in your web browser
3. Click "Start Game" and begin playing!

### Deploy Your Own:
See [DEPLOYMENT.md](.github/DEPLOYMENT.md) for GitHub Pages setup instructions

## 📁 Project Structure

```
Ani-charades/
├── index.html      # Main game page
├── admin.html      # Admin panel for managing words
├── app.js          # Game logic
├── admin.js        # Admin panel logic
├── styles.css      # All styling
└── README.md       # This file
```

## 🎯 How to Play

1. **Choose Settings**: Select difficulty level and time limit
2. **Start Game**: Click the "Start Game" button
3. **Act It Out**: The player sees a word/phrase on screen and acts it out (without speaking!)
4. **Teammates Guess**: Other players try to guess what's being acted
5. **Next/Skip**: 
   - Click "Next Word" or press Space/Enter when guessed correctly
   - Click "Skip" or press Right Arrow to skip a difficult word
6. **Time's Up**: Game ends when timer reaches zero

## ⚙️ Admin Panel

Access the admin panel by clicking "Admin Panel" at the bottom of the game page, or navigate to `admin.html`.

### Features:
- **Add Words**: Create custom words/phrases with difficulty levels
- **View All Words**: Filter by difficulty or view all
- **Delete Words**: Remove unwanted words
- **Export**: Download your word list as JSON
- **Import**: Upload a JSON file with custom words
- **Reset**: Restore default word collection

### JSON Format for Import:
```json
{
  "easy": ["Word 1", "Word 2"],
  "medium": ["Word 3", "Word 4"],
  "hard": ["Word 5", "Word 6"]
}
```

## 🌐 Hosting on GitHub Pages

This project is configured for GitHub Pages deployment. Here's how to deploy:

### Step-by-Step Deployment:

1. **Commit your files** (if you haven't already):
   ```bash
   git add .
   git commit -m "Initial commit - Charades game"
   ```

2. **Push to GitHub**:
   ```bash
   git push origin master
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages** (in left sidebar)
   - Under **Source**, select your branch (`master` or `main`)
   - Select **/ (root)** folder
   - Click **Save**

4. **Wait for deployment** (1-2 minutes)
   - Your site will be live at: `https://mechworrior.github.io/Ani-charades/`
   - Admin panel at: `https://mechworrior.github.io/Ani-charades/admin.html`

### Updating Your Live Site:
Simply commit and push changes - GitHub Pages automatically redeploys!

```bash
git add .
git commit -m "Updated game content"
git push origin master
```

### Why GitHub Pages?
- ✅ **100% Free** hosting
- ✅ **No server setup** required
- ✅ **Automatic HTTPS** 
- ✅ **Auto-deploys** on every push
- ✅ **Custom domains** supported (optional)
- ✅ **Perfect for static sites** like this game

### Alternative Free Hosting Options
### Alternative Free Hosting Options

If you prefer other platforms:

**Netlify:**
1. Push your code to GitHub
2. Go to [netlify.com](https://www.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Deploy! (No configuration needed)

**Vercel:**
1. Go to [vercel.com](https://vercel.com/)
2. Import your GitHub repository
3. Deploy with one click

**Cloudflare Pages:**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com/)
2. Connect GitHub repository
3. Deploy!

## 🛠️ Customization

### Adding Default Words
Edit the `defaultWords` object in `app.js`:

```javascript
const defaultWords = {
    easy: ["Your", "Easy", "Words"],
    medium: ["Your", "Medium", "Words"],
    hard: ["Your", "Hard", "Words"]
};
```

### Changing Colors
Modify the CSS variables in `styles.css` or edit the gradient colors:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjusting Time Limits
Change the min/max values in `index.html`:

```html
<input type="number" id="timeLimit" value="60" min="30" max="300" step="10">
```

## 🎨 Design

The game features:
- Modern gradient design (purple/blue theme)
- Smooth animations and transitions
- Clean, intuitive interface
- Mobile-responsive layout
- Accessible color contrasts

## 💾 Data Storage

All custom words are stored in the browser's localStorage. This means:
- ✅ No server needed
- ✅ Data persists between sessions
- ✅ Works offline
- ⚠️ Data is browser-specific (not synced across devices)
- ⚠️ Clearing browser data will delete custom words (use export to backup!)

## 🔧 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Opera (v76+)

## 📱 Mobile Support

Fully responsive and touch-friendly. The game works great on:
- Smartphones
- Tablets
- Desktop computers

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Multiple languages support
- Team mode with score tracking
- Sound effects and animations
- Categories (movies, animals, sports, etc.)
- Multiplayer with WebRTC
- Dark mode theme

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Credits

Created with ❤️ for charades enthusiasts everywhere!

---

**Ready to play?** Just open `index.html` and start acting! 🎭
