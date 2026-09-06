# CV → Landing Page Conversion Flow

This document describes how to turn a CV into an interactive landing page using the LandingPages repo.

---

## 1. Inputs

### Accepted formats
- **Structured data (preferred):** JSON or form fields extracted from a CV.
- **PDF:** Parsed into structured data via text extraction.

### Minimum structured fields
```json
{
  "name": "",
  "role": "",
  "summary": "",
  "email": "",
  "phone": "",
  "location": "",
  "skills": [],
  "experience": [
    { "title": "", "company": "", "period": "", "description": "" }
  ],
  "education": [
    { "degree": "", "school": "", "period": "" }
  ],
  "projects": [
    { "name": "", "url": "", "description": "" }
  ],
  "links": {
    "linkedin": "",
    "github": "",
    "website": ""
  }
}
```

---

## 2. Template Selection Logic

Choose the CV template variant based on profile type:

| Signal | Recommended variant |
|--------|---------------------|
| Strong project list + links | Portfolio-heavy layout |
| Long experience history | Timeline-first layout |
| Academic/research focus | Education-first layout |
| Freelancer/creator | Services + testimonials layout |
| Student/new grad | Skills + projects layout |

Default fallback: **Skills → Projects → Experience → Contact**.

---

## 3. Conversion Steps

1. **Intake**
   - User uploads PDF or fills a form.
   - Parse PDF to JSON when possible; otherwise use form input.

2. **Enrichment**
   - Auto-detect role keywords and assign a template variant.
   - Normalize phone/email/LinkedIn/GitHub URLs.

3. **Render**
   - Map JSON fields to template sections.
   - Generate a deployable folder with `index.html`, `styles.css`, `main.js`, and `config.json`.

4. **Review**
   - Show a preview link or local file.
   - Collect edits: wording, ordering, accent color, hero image.

5. **Launch**
   - Commit the folder to the repo or deploy to GitHub Pages / static host.
   - Optionally add a custom domain.

---

## 4. Output Structure

```
CvTemplate/
  index.html
  styles.css
  main.js
  config.json
```

### config.json (example)
```json
{
  "name": "Alex Example",
  "role": "Product Designer",
  "summary": "Brief professional summary focused on outcomes.",
  "email": "alex@example.com",
  "phone": "+56 9 0000 0000",
  "location": "Santiago, Chile",
  "skills": ["Figma", "Research", "Prototyping"],
  "experience": [],
  "education": [],
  "projects": [],
  "links": { "linkedin": "", "github": "", "website": "" },
  "accent": "#0f766e",
  "avatar": "",
  "resume_pdf_url": ""
}
```

### Key behaviors
- `index.html` should be generic and driven by `main.js`.
- `main.js` reads `config.json` and injects content into section containers.
- Keep all paths relative so the folder works on GitHub Pages.

---

## 5. Delivery Checklist

- [ ] Valid JSON in `config.json`
- [ ] All URLs use HTTPS where possible
- [ ] Mobile view checked at ~390px width
- [ ] Contact form submits to `mailto:` by default or configured endpoint
- [ ] Accessibility basics: headings order, focus styles, alt text placeholders
