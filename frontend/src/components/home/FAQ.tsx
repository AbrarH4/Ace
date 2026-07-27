function FAQ() {
  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-heading">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know before getting started with ACE.</p>
        </div>

        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                Which file types are supported by ACE?
              </button>
            </h2>

            <div
              id="faq1"
              className="accordion-collapse collapse show"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                ACE supports PDF, DOCX, PPTX, Markdown (.md), TXT and more
                formats will be added in future updates.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                How does ACE answer questions?
              </button>
            </h2>

            <div
              id="faq2"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                ACE answers questions using your uploaded study material instead
                of relying solely on general internet knowledge, making
                responses more accurate and relevant to your notes.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
              >
                Can I generate flashcards and quizzes?
              </button>
            </h2>

            <div
              id="faq3"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Yes. ACE can instantly generate revision flashcards and
                AI-powered quizzes directly from your uploaded notes.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq4"
              >
                Is my data private?
              </button>
            </h2>

            <div
              id="faq4"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Absolutely. Your uploaded documents remain private and are only
                used to provide your personalized study experience.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq5"
              >
                Is ACE free to use?
              </button>
            </h2>

            <div
              id="faq5"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Yes. ACE is free to get started with. Premium plans may be
                introduced later for advanced AI features and higher usage
                limits.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
