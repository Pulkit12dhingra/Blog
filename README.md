# Byte-Sized Brilliance Blog: Project Structure

Welcome to the source repository for my technical blog focused on AI, coding tutorials, and hands-on projects. Below is a breakdown of the project structure and how everything fits together.

<h2>Directory Structure</h2>

<pre>
.
├── index.html
├── /data
│   ├── blogData.json
│   └── style.css
├── /content
│   └── Blog_*.html
├── /img
│   └── *.png / *.jpg
├── /notebooks
│   └── *.ipynb
</pre>

---

## File & Folder Descriptions

### `index.html`
This is the main landing page for the blog. It loads blog summaries dynamically using JavaScript and `blogData.json` as the source of truth. Includes the structure and layout logic for displaying blog tiles and navigation.

---

### `/data`

#### `blogData.json`
This JSON file acts as a lightweight "database" that maintains metadata for all published blogs. It's used by `index.html` to dynamically list and render blogs on the homepage.

**Example entry:**
```json
{
  "file": "Blog_10.html",
  "title": "Building a RAG Pipeline with PDFs, Chroma DB, and Gemma 3",
  "summary": "Step-by-step guide to building a Retrieval-Augmented Generation pipeline using LangChain, HuggingFace embeddings, and your own PDF (resume) as a knowledge base.",
  "date": "May 9, 2025"
}
```

**Keys:**
- `file`: The HTML file in the /content directory.
- `title`: Displayed as the blog post headline.
- `summary`: Short description used in the preview.
- `date`: Used to sort and display publication dates.

#### `style.css`
This is the main stylesheet that overrides and extends the base Bootstrap 5 styles. It provides custom theming, layout tweaks, and component adjustments for a consistent blog look.

---

### `/content`
This folder contains individual blog posts written in HTML. Each blog is a standalone page (Blog_1.html, Blog_2.html, etc.), and includes:
- A return link to index.html
- Metadata for SEO/social sharing
- Embedded code snippets, tables, or images
- Bootstrap-based responsive layouts

---

### `/img`
Houses all the images used throughout the blogs, including diagrams, outputs, icons, and social preview images.

---

### `/notebooks`
Contains Jupyter Notebooks used in blog tutorials. These are referenced via GitHub links in the blog posts and serve as the executable source for tutorials.

---

## How It Works
- Blog metadata lives in blogData.json.
- index.html uses JS to render blog tiles based on this metadata.
- Clicking a tile links to the corresponding file in /content.
- Custom styles are loaded from style.css.

---

## Notes
- Bootstrap 5 and FontAwesome are included via CDN.
- Open Graph + Twitter meta tags are embedded in each blog for better sharing.
- Blogs are statically linked with no backend required.

---

## Tip
If you're adding a new blog:
1. Create Blog_N.html inside /content.
2. Add an image (if any) in /img.
3. Append a new object to blogData.json with title, file, summary, and date.
4. You're done!

Enjoy reading and happy coding!
* https://pulkit12dhingra.github.io/Blog/
