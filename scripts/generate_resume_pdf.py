"""Generate ATS-friendly resume PDF aligned with data/resume.js content."""

from fpdf import FPDF
from pathlib import Path

OUTPUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "resume" / "AliMehdiKhan Resume Optimized.pdf"


class ResumePDF(FPDF):
    def write_line(self, text: str, style: str = "", size: int = 9, h: float = 5):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", style, size)
        self.multi_cell(self.epw, h, text)
        self.ln(0.5)

    def section(self, title: str):
        self.ln(1)
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 11)
        self.cell(self.epw, 6, title)
        self.ln(6)
        y = self.get_y()
        self.line(self.l_margin, y, self.w - self.r_margin, y)
        self.ln(2)

    def bullet(self, text: str):
        self.write_line(f"- {text}")


def build():
    pdf = ResumePDF()
    pdf.set_auto_page_break(auto=True, margin=12)
    pdf.add_page()

    pdf.write_line("ALI MEHDI KHAN", "B", 16, 8)
    pdf.write_line(
        "Lucknow, Uttar Pradesh, India | +91-9569042552 | ali973mehdi@gmail.com",
        size=9,
    )
    pdf.write_line(
        "https://www.linkedin.com/in/ali-mehdi-khan-b4062b2a3 | https://alimehdikhan.github.io | https://github.com/alimehdikhan",
        size=9,
    )

    pdf.section("SUMMARY")
    pdf.write_line(
        "B.Tech Computer Science graduate (2026) skilled in Python, Java, Machine Learning, and AI application development. "
        "Google Cloud and Deloitte certified. Seeking an entry-level Software Engineering or AI/ML role to deliver impactful, data-driven solutions."
    )

    pdf.section("EXPERIENCE")
    pdf.write_line("Machine Learning Intern", "B")
    pdf.write_line("BBD University | June 2025 - July 2025 | Lucknow")
    pdf.bullet(
        "Built skin cancer detection and diabetes prediction models using supervised learning and deep learning in Python, applying feature engineering and hyperparameter tuning to maximize accuracy."
    )

    pdf.section("PROJECTS")
    pdf.write_line("AI Pronunciation Coach", "B")
    pdf.write_line("github.com/alimehdikhan/A.I-Pronunciation-Coach")
    pdf.bullet(
        "Engineered an AI pronunciation coaching platform using OpenAI Whisper and NLP; built low-latency audio processing and scoring pipelines with FastAPI for real-time spoken English feedback."
    )
    pdf.write_line("Cancer Detection System", "B")
    pdf.write_line("github.com/alimehdikhan/Cancer-Detection-Model")
    pdf.bullet(
        "Trained a binary classification model on real-world medical datasets using Keras deep learning architectures, achieving 90%+ accuracy for early-stage cancer prediction."
    )

    pdf.section("EDUCATION")
    pdf.write_line("Bachelor of Technology in Computer Science and Engineering")
    pdf.write_line("Babu Banarasi Das University | Lucknow | 2026")
    pdf.write_line("Indian School Certificate (Class XII)")
    pdf.write_line("Unity College | Lucknow | 2022")
    pdf.write_line("Indian Certificate of Secondary Education (Class X)")
    pdf.write_line("Unity College | Lucknow | 2020")

    pdf.section("CERTIFICATIONS")
    for cert in [
        "Technology Job Simulation - Deloitte via Forage | July 2025",
        "Build Real-World AI Apps with Gemini and Imagen - Google Cloud Skill Badge | 2025",
        "Machine Learning with Python - freeCodeCamp | July 2025",
        "Prompt Design in Vertex AI - Google Cloud Skill Badge | 2025",
    ]:
        pdf.bullet(cert)

    pdf.section("INVOLVEMENT")
    pdf.write_line("Volunteer - Tech for Good", "B")
    pdf.bullet(
        "Delivered programming training to 30+ underprivileged students over 3 months, improving digital literacy and enabling participants to build their first functional applications."
    )

    pdf.section("AWARDS & HONORS")
    pdf.bullet(
        "Exemplary Discipline Award - Maintained 95%+ attendance across all academic terms, demonstrating reliability and commitment."
    )

    pdf.section("SKILLS")
    pdf.write_line(
        "Technical: Python, Java, C, C++, JavaScript, SQL, FastAPI, TensorFlow, Keras, Git, GitHub, REST APIs, Machine Learning, NLP, HTML, CSS"
    )
    pdf.write_line(
        "Soft Skills: Communication, Problem Solving, Team Collaboration, Adaptability, Time Management"
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUTPUT))
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    build()