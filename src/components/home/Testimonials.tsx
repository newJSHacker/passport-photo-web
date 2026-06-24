const reviews = [
  {
    quote:
      "I recently applied to have my passport renewed and needed to update my photos. I downloaded and used the Digital Passport Photos app. The whole process was simple, quick and easy, the price was unbeatable. I will definitely be using this service again!",
    author: "Dawn (GB)",
  },
  {
    quote:
      "The photo came out excellent! This was so convenient, and shipping was quick also. Yes, I will be using this company again in the future.",
    author: "Amanda (US)",
  },
  {
    quote:
      "Great! Super easy, fast and efficient! Love that I didn't have to struggle getting my baby to sit on my lap in a booth.",
    author: "Brittany (GB)",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-section">
      <div className="container-main">
        <h2 className="typography-h2 text-center">Why Customers Love Us</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-navy">
          Don&apos;t just take our word for it—see some of the real reviews from
          our satisfied customers:
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.author}
              className="rounded-lg border border-[#d5d5dc] bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-[#00b67a]"
                    aria-hidden
                  >
                    <path d="M12 1.5l2.9 6.1 6.8.6-5.1 4.5 1.5 6.6L12 16.9 5.9 19.3l1.5-6.6-5.1-4.5 6.8-.6L12 1.5z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-6 text-navy">{review.quote}</p>
              <p className="mt-4 text-sm font-semibold text-navy">
                {review.author}
              </p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-7 text-navy">
          Even taking your baby&apos;s passport photo can be a breeze—no need to
          get your little ones to sit in a photo booth, now you can take their
          photo from the comfort of your home.
        </p>
      </div>
    </section>
  );
}
